require("dotenv").config();
const app = require("./app");
const connectDB = require("./db/connectDB");

let connectionPromise;

function validateConfiguration() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }
}

async function ensureDatabaseConnection() {
  validateConfiguration();
  if (!connectionPromise) {
    connectionPromise = connectDB().catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }
  return connectionPromise;
}

module.exports = async (req, res) => {
  try {
    await ensureDatabaseConnection();
    return app(req, res);
  } catch (error) {
    console.error("Serverless initialization failed", error);
    return res.status(503).json({ message: "Service temporarily unavailable" });
  }
};
