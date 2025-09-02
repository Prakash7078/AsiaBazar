const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const multer=require('multer');
const authRouter=require('./routes/authRoutes');
const adminRouter = require('./routes/adminRoutes');
const productRouter=require('./routes/productRoutes');
const connectDB=require('./db/connectDB');
const app = express();
dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB in bytes
  },
});
app.use(cors());
app.use(express.json());
//socket server





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