const crypto = require("node:crypto");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/adminRoutes");
const productRouter = require("./routes/productRoutes");
const isAuth = require("./middleware/auth");

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, callback) => {
    callback(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype));
  },
});

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
if (process.env.TRUST_PROXY === "1") app.set("trust proxy", 1);
app.use((req, res, next) => {
  const requestId = req.get("x-request-id") || crypto.randomUUID();
  req.requestId = requestId;
  res.set("x-request-id", requestId);
  res.set("x-content-type-options", "nosniff");
  res.set("x-frame-options", "DENY");
  res.set("referrer-policy", "no-referrer");
  next();
});
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(Object.assign(new Error("Origin is not allowed"), { status: 403 }));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type", "X-Request-Id"],
}));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.get("/ready", (_req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ status: ready ? "ready" : "not-ready" });
});

app.post("/create-payment-intent", isAuth, async (req, res, next) => {
  try {
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount < 0.5 || amount > 10000) {
      return res.status(400).json({ message: "Amount must be between $0.50 and $10,000" });
    }
    if (!process.env.STRIPE_SECRET) {
      return res.status(503).json({ message: "Payments are not configured" });
    }
    const stripe = require("stripe")(process.env.STRIPE_SECRET);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return next(error);
  }
});

app.use("/api/auth", upload.single("image"), authRouter);
app.use("/api/admin", upload.array("product_images", 5), adminRouter);
app.use("/api/products", productRouter);

app.use((req, res) => res.status(404).json({ message: "Route not found", requestId: req.requestId }));
app.use((error, req, res, _next) => {
  const status = error.status || (error.name === "MulterError" ? 400 : 500);
  if (status >= 500) console.error(`[${req.requestId}]`, error);
  res.status(status).json({
    message: status >= 500 ? "Internal server error" : error.message,
    requestId: req.requestId,
  });
});

module.exports = app;
