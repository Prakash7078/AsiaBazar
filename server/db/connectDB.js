const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();
let pool;

const connectDB = async () => {
  if(!pool){
    pool = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: process.env.SQL_PASSWORD,
      database: 'asiabazar',
    });
  }
  console.log('✅ MySQL connected',pool);
  return pool;
};

module.exports = connectDB;
