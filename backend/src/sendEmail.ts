import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Route pour envoyer un email
app.post('/send-invitation', async (req, res) => {
  const { to } = req.body;

  if (!to) return res.status(400).json({ message: 'Email du destinataire requis' });

  const mailOptions = {
    from: `"ons 👻" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Invitation à rejoindre notre plateforme',
    text: 'Cliquez sur le lien ci-dessous pour accepter l’invitation.',
    html: `
      <p>Bonjour,</p>
      <p>Cliquez sur le bouton ci-dessous pour accepter l'invitation :</p>
      <a href="http://example.com/accept-invitation" style="
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        border-radius: 5px;
      ">Accepter l'invitation</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Invitation envoyée avec succès' });
  } catch (error) {
    res.status(500).json({ message: "Erreur d'envoi de l'email", error });
  }
});

