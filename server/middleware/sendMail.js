const nodemailer=require("nodemailer");
const User = require("../models/userModel");
const Notifications = require("../models/notificationModel");
const sendMail=async(email,message)=>{
    try{
        //Create a transporter
        const userInfo=await User.findOne({email:email});
        await Notifications.create({user: userInfo, text: message});

        const transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"vvitclubs7078@gmail.com",
                pass:process.env.PASS,
            },
        });
        const mailOptions={
            from:"vvitclubs7078@gmail.com",
            to:email,
            subject:"Message from VVIT Clubs",
            text:`${message}`,
        };
        transporter.sendMail(mailOptions,(error)=>{
            if(error){
                console.log("Error occured while sending mail",error.message);
            }else{
                console.log("email sent");
                res.status(200).json({ message: "Email sent successfully from atoms" });
            }
        })
    } catch (err) {
        throw new Error(err.message);
    }

};
module.exports={sendMail};