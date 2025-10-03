const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../middleware/utils");
const expressAsyncHandler = require("express-async-handler");
const uploadImage = require("../middleware/uploadMiddleware");
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");

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

module.exports = { signup, login };
