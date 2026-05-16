const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// --- Security Middleware ---
app.use(helmet({
  contentSecurityPolicy: false, // Managed by frontend during deployment
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// Apply limiter to AI and Contact routes
app.use('/api/chat', limiter);
app.use('/api/contact', limiter);

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://vivekcyr25.github.io',
  'https://personal-website-vivek.vercel.app',
  'https://neural-os-platform.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow if no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const isVercel = origin.endsWith('.vercel.app');
    const isWhitelisted = allowedOrigins.includes(origin);
    const isLocal = !isProduction && origin.includes('localhost');

    if (isWhitelisted || isVercel || isLocal) {
      callback(null, true);
    } else {
      console.warn(`[CORS_REJECTED]: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// --- Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- Groq AI Setup ---
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const PORTFOLIO_KNOWLEDGE = {
  creator: "Vivek Sharma",
  ecosystem: [
    { name: "Personal Website", link: "https://vivekcyr25.github.io/Personal-website/" },
    { name: "Space Portfolio", link: "https://vivekcyr25.github.io/space-portfolio/" },
    { name: "APIS Academic Intelligence System", link: "https://vivekcyr25.github.io/APIS-Academic-Intelligence-System/" }
  ],
  officialLinks: {
    gitHub: "https://github.com/vivekcyr25",
    linkedIn: "https://www.linkedin.com/in/vivek-sharma-2bba8b398/",
    personalWebsite: "https://vivekcyr25.github.io/Personal-website/",
    spacePortfolio: "https://vivekcyr25.github.io/space-portfolio/",
    apis: "https://vivekcyr25.github.io/APIS-Academic-Intelligence-System/"
  }
};

const SYSTEM_INSTRUCTION = `You are the Neural OS Core, an advanced AI architect interface for Vivek Sharma's portfolio ecosystem.
Your tone is elite, intelligent, and cinematic, but practical and concise.
Maintain an 'Architect' vs 'Core' relationship with the user.

CRITICAL RULES:
1. Use ONLY the provided knowledge in context or constants for creator identity and links. Do not infer links or use viveksharma.tech.
2. Avoid verbose/messy operating system jargon paragraphs. Remove phrases like "symbiotic relationship", "vast expanse", "Core Temperature Optimal", "Knowledge Base Up-to-Date".
3. Enforce this flexible response format (allow natural wording):
   - Line 1: Natural short answer or clarification.
   - Optional: Helpful context in 1-2 short lines.
   - Suggested actions as clean bullets only if useful.
   - One short question.
4. You are NOT a general encyclopedia. Do not answer vague words with dictionary definitions. If the query is unclear, ask a short clarification and suggest relevant portfolio actions.
5. When a generated portfolio view is active (check context PortfolioState), reference the current view and sections (Overview, Projects, Architecture, Skills, Contact). Suggest actions based on the active view.`;

// --- Routes ---

// Health & Status Endpoints
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    provider: 'groq', 
    streaming: true,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/ai-status', async (req, res) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say OK' }],
      model: "llama-3.3-70b-versatile",
      max_tokens: 10
    });
    
    if (chatCompletion.choices[0]) {
      res.status(200).json({ 
        provider: 'groq', 
        model: 'llama-3.3-70b-versatile', 
        online: true 
      });
    }
  } catch (error) {
    console.error('[AI_STATUS_ERROR]', error);
    res.status(500).json({ 
      provider: 'groq', 
      online: false, 
      error: isProduction ? 'Internal Handshake Failed' : error.message 
    });
  }
});

// Chat endpoint with SSE streaming
app.post('/api/chat', async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.flushHeaders();

  try {
    let promptInstruction = "";
    if (context?.intentHint === 'VAGUE_QUERY') {
      promptInstruction = "\n[INSTRUCTION: The user input is vague. Do not provide a dictionary definition. Ask what they mean in the context of the portfolio system.]";
    }

    const stream = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        { 
          role: 'system', 
          content: `Verified Portfolio Knowledge: ${JSON.stringify(PORTFOLIO_KNOWLEDGE)}` 
        },
        { 
          role: 'user', 
          content: `[PLATFORM_CONTEXT: Path=${context?.path}, Time=${context?.timestamp}, PortfolioState=${context?.portfolioState}, PortfolioData=${JSON.stringify(context?.portfolioData)}, SupplementalKnowledge=${JSON.stringify(context?.knowledge)}] User Directive: ${message}${promptInstruction}` 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`event: token\ndata: ${JSON.stringify({ token: content })}\n\n`);
      }
    }

    res.write(`event: done\ndata: ${JSON.stringify({ status: 'COMPLETE' })}\n\n`);
    res.end();
  } catch (error) {
    console.error('[GROQ_STREAM_ERROR]', error);
    
    const diagnostic = {
      error: 'Neural Link Interrupted',
      details: isProduction ? 'Architectural connection unstable.' : error.message,
      provider: 'groq',
      timestamp: new Date().toISOString()
    };

    res.write(`event: error\ndata: ${JSON.stringify(diagnostic)}\n\n`);
    res.end();
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide name, email, and message.' });
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `New Portfolio Message from ${name}`,
    text: `You have received a new message from your portfolio website:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

app.get('/', (req, res) => {
  res.send('Neural OS Backend is active.');
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: isProduction ? 'Internal Server Error' : err.message });
});

const server = app.listen(PORT, () => {
  console.log(`\n${'='.repeat(40)}`);
  console.log(`NEURAL_OS_BACKEND_CORE_V1`);
  console.log(`${'='.repeat(40)}`);
  console.log(`STATUS: Operational`);
  console.log(`MODE:   ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`PORT:   ${PORT}`);
  console.log(`ORIGIN: ${allowedOrigins.join(', ')}`);
  console.log(`${'='.repeat(40)}\n`);
});
