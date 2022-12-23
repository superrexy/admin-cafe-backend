const nodemailer = require("nodemailer");

const emailService = nodemailer.createTransport({
  host: process.env.CONFIG_SMTP_HOST,
  port: process.env.CONFIG_SMTP_PORT,
  auth: {
    user: process.env.CONFIG_SMTP_EMAIL,
    pass: process.env.CONFIG_SMTP_PASSWORD,
  },
});

module.exports = emailService;
