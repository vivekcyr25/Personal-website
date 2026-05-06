const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

// Routes
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
