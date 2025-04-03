const nodemailer = require("nodemailer");
require('dotenv').config()
const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secure: true,
        port: 465,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: '"Your App Name" <noreply@yourapp.com>',
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email failed to send:", error);
    }
};

module.exports = sendEmail;
