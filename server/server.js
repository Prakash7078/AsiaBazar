const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const multer=require('multer');
const authRouter=require('./routes/authRoutes');
const adminRouter = require('./routes/adminRoutes');
const productRouter=require('./routes/productRoutes');
const connectDB=require('./db/connectDB');
const Product = require('./models/productModel');
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET);


dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB in bytes
  },
});
app.use(cors());

//middlewares
app.use(express.json());
//socket server

//create payment Intent used to send client secret to client
app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;
  const amountInCents = Math.round(amount * 100);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});



app.use("/api/auth",upload.single("image"), authRouter);
app.use("/api/admin",upload.array("product_images", 5),adminRouter)
app.use("/api/products",productRouter)



const port = process.env.PORT || 5001;

// Start the server
const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

