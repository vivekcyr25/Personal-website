const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password here
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('Error with email service:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Gemini AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest",
  systemInstruction: "You are the AI assistant for Vivek Sharma's portfolio website. Vivek is an 18-year-old B.Tech CSE student at Lovely Professional University. He is an aspiring software developer. \n\nCORE RULES:\n1. Be concise and professional.\n2. Do NOT repeat your full introduction in every message. Only mention you are Vivek's assistant if it's the start of the conversation or specifically asked.\n3. Answer questions about Vivek's skills (C, Python, HTML, CSS, JavaScript), projects (Student Marks Portal), and education directly.\n4. If asked about unrelated topics (e.g., space, math, general facts), answer them briefly and accurately using your general knowledge. You don't always have to link it back to the portfolio unless it makes sense.\n5. Use English, Hindi, or Hinglish based on the user's input.",
});

// Routes
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    res.status(200).json({ reply: text });
  } catch (error) {
    console.error('Gemini AI Error:', error);
    res.status(500).json({ error: 'AI failed to respond. Please try again.' });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide name, email, and message.' });
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, // Sending to yourself
    subject: `New Portfolio Message from ${name}`,
    text: `You have received a new message from your portfolio website:
    
Name: ${name}
Email: ${email}
Message: ${message}`,
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

app.get('/', (req, res) => {
  res.send('Portfolio Backend is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
