const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB=require('../db/connectDB.js');
const { generateToken } = require("../middleware/utils");
const expressAsyncHandler = require("express-async-handler");
const uploadImage = require("../middleware/uploadMiddleware");
const userRoutes = express.Router();
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
// const { sendMail } = require("../middleware/sendMail");
dotenv.config();



// userRoutes.get("/:rollno", async (req, res) => {
//   const result = await User.find({ rollno: req.params.rollno });
//   res.send(result);
// });
// const profile = expressAsyncHandler(async (req, res) => {
//   const { id } = req.body;
//   const { name, email, branch, rollno, section, year } = req.body;
//   const newOne = await User.findByIdAndUpdate(id, {
//     username: name,
//     email: email,
//     branch: branch,
//     rollno: rollno,
//     section: section,
//     year: year,
//   });
//   if (req.file) {
//     await uploadImage("profiles", req.file);
//     newOne.image = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/profiles/${req.file.originalname}`;
//   } else {
//     newOne.image = req.body.image;
//   }
//   newOne.save();
//   console.log(newOne);
//   return res
//     .status(StatusCodes.OK)
//     .json({ user: newOne, message: "Profile Update Succesfully" });
// });
// const resetPassword = expressAsyncHandler(async (req, res) => {
//   const { id, token } = req.params;
//   const { password } = req.body;
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: "Error with token" });
//     }
//   });
//   const hash = bcrypt.hashSync(password);
//   console.log("hash", hash);
//   await User.findByIdAndUpdate(id, { password: hash });
//   return res
//     .status(StatusCodes.OK)
//     .json({ message: "password updated succesfully..." });
// });
// const forgotPassword = expressAsyncHandler(async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return res
//       .status(StatusCodes.NOT_FOUND)
//       .json({ message: "User Not Exist" });
//   }
//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "1d",
//   });
//   const message = `https://vvit-clubs.vercel.app/reset-password/${user._id}/${token}`;
//   await sendMail(user.email, message);
//   return res.status(StatusCodes.OK).json({ message: "mail sent succesfully" });
// });

const login = expressAsyncHandler(async (req, res) => {
  console.log("logn", req.body.data.email.toLowerCase());
  const db = await connectDB(); // ✅ Get the pool first
  const [rows] =await db.query(
    `SELECT * FROM Users WHERE email = ?`, 
    [req.body.data.email.toLowerCase()]
  );
  console.log(rows[0])
  const user = rows[0];
  if (!user) {
    res.status(403).send({ error: "user not found" });
  }
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
  const db = await connectDB(); // ✅ Get the pool first

  const [existingUser] =await db.query(
    `SELECT * FROM Users WHERE email = ?`, 
    [email]
  );

  if (existingUser.length>0) {
    return res.status(400).json({ error: "User already exists" });
  }
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log("hashed",hashedPassword)
  const [result] = await db.query(
    `INSERT INTO Users (name, email, password, mobile_no, address, admin)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email.toLowerCase(), hashedPassword, mobileno, address, admin]
  );
  
  // ✅ Define the newUser object
  const newUser = {
    user_id: result.insertId,
    name,
    email: email.toLowerCase(),
    mobile_no: mobileno,
    address,
    admin
  };
  console.log(newUser);
  const token = generateToken(newUser);
  res.status(201).json({ token, user: newUser });
});
module.exports = { signup,login};
