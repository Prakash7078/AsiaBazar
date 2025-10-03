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
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with a failure code
  }
};
module.exports=connectDB;
