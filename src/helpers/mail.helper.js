const nodemailer = require("nodemailer");

const emailService = nodemailer.createTransport({
  service: process.env.CONFIG_SMTP_SERVICE,
  auth: {
    user: process.env.CONFIG_SMTP_EMAIL,
    pass: process.env.CONFIG_SMTP_PASSWORD,
  },
});

module.exports = emailService;
