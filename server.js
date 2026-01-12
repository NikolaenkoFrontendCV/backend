const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const toml = require('toml');

const config = toml.parse(fs.readFileSync('./config.toml', 'utf-8'));

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: "alexnikol092004@gmail.com",
      pass: config.gmail.emailkey,
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
  const {  } = req.body;

  try {
    await transporter.sendMail({
      from: '<alexnikol092004@gmail.com>',
      to: "nikol.alex06@mail.ru",
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