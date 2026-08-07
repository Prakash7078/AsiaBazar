const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../middleware/utils");
const expressAsyncHandler = require("express-async-handler");
const uploadImage = require("../middleware/uploadMiddleware");
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");
const {sendMail} = require("../middleware/sendMail");
// Import the User model

dotenv.config();

const login = expressAsyncHandler(async (req, res) => {
  const email = req.body?.data?.email?.toLowerCase?.().trim?.();
  const password = req.body?.data?.password;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Email and password are required" });
  }

  const user = await User.findOne({ email }).lean();

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid email or password" });
  }

  const token = generateToken(user);
  delete user.password;
  return res.status(StatusCodes.OK).json({ token, user });
});

const signup = expressAsyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    mobileno,
    address,
  } = req.body;

  if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
    return res.status(400).json({ error: "Name, valid email, and an 8+ character password are required" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  // Create and save new user document
  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    mobile_no: mobileno,
    address,
    admin: false,
  });

  const token = generateToken(newUser);
  const safeUser = newUser.toObject();
  delete safeUser.password;
  res.status(201).json({ token, user: safeUser });
});


const updateProfile = expressAsyncHandler(async (req, res) => {
  const { user_id } = req.params;  
  const { name, email, phone, address } = req.body;  
  try {
    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { name, email, mobile_no:phone, address },
      { new: true, runValidators: true, select: "-password" } // new:true returns updated doc
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
});
const resetPassword = expressAsyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (String(decoded.id) !== String(id)) throw new Error("Token does not match user");
  } catch (_error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid or expired token" });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password must contain at least 8 characters" });
  }
  const hash = bcrypt.hashSync(password, 10);
  // console.log("hash", hash);
  await User.findByIdAndUpdate(id, { password: hash });
  return res
    .status(StatusCodes.OK)
    .json({ message: "password updated succesfully..." });
});
const forgotPassword = expressAsyncHandler(async (req, res) => {
  const email = req.body?.email?.toLowerCase?.().trim?.();
  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Email is required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User Not Exist" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const message = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #16a34a; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px;">🛒 Asia Bazzar</h1>
          <p style="color: #dcfce7; margin: 6px 0 0;">Password Reset Request</p>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
          <h2 style="color: #1f2937;">Forgot your password? 🔐</h2>
          <p style="color: #6b7280; font-size: 15px;">
            We received a request to reset your password. Click the button below to set a new one.
          </p>

          <!-- Reset Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${user._id}/${token}"
              style="background-color: #16a34a; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
              Reset My Password
            </a>
          </div>

          <!-- Warning Box -->
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #991b1b; font-size: 14px;">
              ⚠️ This link will expire in <strong>15 minutes</strong>. If you didn't request a password reset, please ignore this email — your account is safe.
            </p>
          </div>

          <!-- Fallback link -->
          <p style="color: #9ca3af; font-size: 13px;">
            If the button doesn't work, copy and paste this link into your browser:
            <br/>
            <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${user._id}/${token}"
              style="color: #16a34a; word-break: break-all;">
              ${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${user._id}/${token}
            </a>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 13px; margin: 0;">© 2025 Asia Bazzar. All rights reserved.</p>
        </div>

      </div>
    </body>
    </html>
    `;
  try{
    await sendMail(user.email, message);
  }catch(err){
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message || "Error sending email" });
  }
  return res.status(StatusCodes.OK).json({ message: "mail sent succesfully" });
});


module.exports = { signup, login,updateProfile,resetPassword,forgotPassword };
