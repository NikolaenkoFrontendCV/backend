require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.send('Server is running');
});

// Роут для отправки email
app.post('/send-contacts', async (req, res) => {
  res.set(
    {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  )

  try {
    await transporter.sendMail({
      from: `<${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "Контакты с сайта",
      text: JSON.stringify(req.body),
    });
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));