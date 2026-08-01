require("dotenv").config();
const app = require("./app");
const connectDB = require("./db/connectDB");

const port = Number(process.env.PORT) || 5001;
let server;

async function start() {
  if (!process.env.MONGODB_URL) throw new Error("MONGODB_URL is required");
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }
  await connectDB();
  server = app.listen(port, () => console.log(`API listening on port ${port}`));
}

async function shutdown(signal) {
  console.log(`${signal} received; shutting down`);
  if (server) await new Promise((resolve) => server.close(resolve));
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection", error);
  process.exit(1);
});

start().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
