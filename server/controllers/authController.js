const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../middleware/utils");
const expressAsyncHandler = require("express-async-handler");
const uploadImage = require("../middleware/uploadMiddleware");
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");
const { BASE_URL } = require("../../client/src/config/url");
const { sendMail } = require("../middleware/sendMail");

// Import the User model

dotenv.config();

const login = expressAsyncHandler(async (req, res) => {
  console.log("login", req.body.data.email.toLowerCase());
  
  // Find user by email
  const user = await User.findOne({ 
      email: req.body.data.email.toLowerCase() 
  }).lean(); 

  if (!user) {
    res.status(403).send({ error: "user not found" });
    return;
  }
  
  // Compare provided password with hashed password
  if (bcrypt.compareSync(req.body.data.password, user.password)) {
    const token = generateToken(user);
    res.status(201).json({ token, user });
    return;
  }
  
  res.status(401).send({ error: "Invalid Password" });
});

const signup = expressAsyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    mobileno,
    address,
    admin,
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log("hashed", hashedPassword)
  
  // Create and save new user document
  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    mobile_no: mobileno,
    address,
    admin,
  });
  
  console.log(newUser);
  const token = generateToken(newUser);
  
  res.status(201).json({ token, user: newUser });
});


const updateProfile = expressAsyncHandler(async (req, res) => {
  const { user_id } = req.params;  
  const { name, email, phone, address } = req.body;  
  try {
    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { name, email, mobile_no:phone, address },
      { new: true, runValidators: true } // new:true returns updated doc
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
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Error with token" });
    }
  });
  const hash = bcrypt.hashSync(password);
  console.log("hash", hash);
  await User.findByIdAndUpdate(id, { password: hash });
  return res
    .status(StatusCodes.OK)
    .json({ message: "password updated succesfully..." });
});
const forgotPassword = expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User Not Exist" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  const message = `${BASE_URL}/reset-password/${user._id}/${token}`;
  const emailres=await sendMail(user.email, message);
  console.log(emailres);
  return res.status(StatusCodes.OK).json({ message: "mail sent succesfully" });
});


module.exports = { signup, login,updateProfile,resetPassword,forgotPassword };
