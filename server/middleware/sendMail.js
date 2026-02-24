const nodemailer = require("nodemailer");
const User = require("../models/userModel");

const sendMail = async (email, message) => {
    try {
        // 1. Fetch user info
        const userInfo = await User.findOne({ email: email });

        // 2. Create a transporter 
        // Note: 'service: gmail' and 'host' together are redundant, 
        // but keeping it explicit for stability.
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // Use true for port 465
            auth: {
                user: "ponduriprakash7078@gmail.com",
                pass: process.env.PASS, // Ensure this is set in Vercel Dashboard
            },
        });

        const mailOptions = {
            from: "ponduriprakash7078@gmail.com",
            to: email,
            subject: "Message from AsiaBazzar",
            html: message,
        };

        // 3. Use the Promise-based version of sendMail (Remove the callback)
        // Vercel requires 'await' to resolve before the function finishes.
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
