const nodemailer = require("nodemailer");
const dotenv=require('dotenv');
dotenv.config();
const sendMail = async (email, message) => {
    try {
        const smtpUser = process.env.EMAIL_FROM || 'ponduriprakash7078@gmail.com';
        const smtpPass = process.env.PASS;

        if (!smtpUser || !smtpPass) {
            throw new Error(
                "SMTP credentials are missing. Set SMTP_USER (or EMAIL_FROM) and SMTP_PASS (or EMAIL_PASS/PASS)."
            );
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        const mailOptions = {
            from: smtpUser,
            to: email,
            subject: "Message from AsiaBazzar",
            html: message,
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log("Email sent successfully:", info.messageId);
        return info;

    } catch (err) {
        console.error("Error occurred while sending mail:", err.message);
        // Throwing the error allows your main API route to catch it and send a 500 response
        throw new Error(err.message);
    }
};

module.exports = { sendMail };
