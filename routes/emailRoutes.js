//emailroutes.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Hoặc dịch vụ bạn sử dụng như 'smtp.mailtrap.io', 'sendgrid', v.v.
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// API để nhận yêu cầu và gửi email
router.post("/send-email", (req, res) => {
  const { to, subject, text, html } = req.body;

  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to,
    subject,
    text,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Error sending email: " + error.message);
    }
    res.status(200).send("Email sent successfully: " + info.response);
  });
});

module.exports = router;
