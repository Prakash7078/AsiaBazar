// const mysql = require('mysql2/promise');
// const dotenv = require('dotenv');
// dotenv.config();
// let pool;

// const connectDB = async () => {
//   if(!pool){
//     pool = await mysql.createPool({
//       host: 'localhost',
//       user: 'root',
//       password: process.env.SQL_PASSWORD,
//       database: 'asiabazar',
//     });
//   }
//   console.log('✅ MySQL connected',pool);
//   return pool;
// };

// module.exports = connectDB;

const mongoose=require("mongoose");
const dotenv=require("dotenv");
const connectDB = async () => {
  dotenv.config();
  const mongoURI = process.env.MONGODB_URL;
  if (!mongoURI) throw new Error("MONGODB_URL is required");
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  await mongoose.connect(mongoURI);
  console.log("Connected to MongoDB");
  return mongoose.connection;
};
module.exports=connectDB;
