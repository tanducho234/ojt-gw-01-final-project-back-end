//emailroutes.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { authenticate, authorize } = require("../middleware/auth");
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
router.post("/send-email", authenticate, authorize(["admin"]), (req, res) => {
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

//write one to thank user for subcribb to recive nofitication from our website
router.post("/subscribe-notification", (req, res) => {
  const { email } = req.body;

  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: email,
    subject: "Thank you for subscribing to notifications",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Thank you for subscribing!</h2>
        <p>We're excited to have you join our notification list. You'll now receive updates about:</p>
        <ul>
          <li>New products and services</li>
          <li>Special offers and promotions</li>
          <li>Important announcements</li>
        </ul>
        <p>Best regards,<br>Your Team</p>
      </div>
    `,
    // <p>If you wish to unsubscribe at any time, please click <a href="#">here</a>.</p>

  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res
        .status(500)
        .send("Error sending subscription email: " + error.message);
    }
    res.status(200).send("Subscription confirmation email sent successfully");
  });
});

module.exports = router;
