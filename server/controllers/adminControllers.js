const expressAsyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const uploadImage = require("../middleware/uploadMiddleware.js");
const dotenv = require("dotenv");
const Product = require("../models/productModel.js");
const Order = require("../models/orderModel.js");
const User = require("../models/userModel.js");


dotenv.config();

// 🔹 Get All Users
const getAllUsers = expressAsyncHandler(async (req, res) => {
  // Mongoose equivalent to: SELECT * FROM Users
  // Use .select('-password') to ensure the password hash is never returned
  const users = await User.find({}).select('-password');
  res.status(StatusCodes.OK).json(users);
});
// 🔹 Add Product
const addProduct = expressAsyncHandler(async (req, res) => {
  const {
    product_name,
    product_price,
    product_size,
    product_category,
    quantity_measure,
    total_products,
    product_description,
    outOfStock,
    discount,
  } = req.body;

  const imageUrls = [];
  // Default to 0 if total_products is not provided/valid
  const totalQty = parseInt(total_products, 10) || 0; 

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const {url} = await uploadImage("asiabazar", file);
      const imageUrl = url;
      imageUrls.push(imageUrl);
    }
  }

  const newProduct = await Product.create({
    product_name,
    product_price,
    product_size,
    quantity_measure,
    total_products: totalQty,
    product_category,
    product_description,
    outOfStock,
    discount,
    product_image: imageUrls,
  });

  res.status(201).json({
    message: "✅ Product added successfully",
    product: newProduct,
  });
});

// 🔹 Delete Product
const deleteProduct = expressAsyncHandler(async(req,res)=>{
  const productId = req.params.id;
  
  const result=await Product.findByIdAndUpdate(req.params.id, { isDeleted: true });
  
  if (!result) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Product not found" });
  }
  
  res.status(StatusCodes.OK).json({ message: "✅ Product deleted successfully" });
});
  
// 🔹 Update Product
const updateProduct = expressAsyncHandler(async (req, res) => {
  const {
    product_name,
    product_price,
    product_size,
    quantity_measure,
    total_products,
    product_category,
    product_description,
    outOfStock,
    discount,
  } = req.body;

  const productId = req.params.id;
  // Parse existing image URLs from the stringified body data
  const existingImages = JSON.parse(req.body.existing_images || "[]");

  const newImageUrls = [];

  // Handle new file uploads
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const { url }=await uploadImage("asiabazar", file);
      const imageUrl = url;
      newImageUrls.push(imageUrl);
    }
  }



  const allImages = [...existingImages, ...newImageUrls];

  const updateFields = {
    product_name,
    product_price,
    product_size,
    quantity_measure,
    total_products,
    product_category,
    product_description,
    product_image: allImages,
    outOfStock,
    discount,
  };
  console.log("Update Fields:", updateFields);

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateFields,
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Product not found" });
  }

  res.status(StatusCodes.OK).json({ message: "✅ Product updated successfully" });
});

// 🔹 Get All Orders
const getAllOrders = expressAsyncHandler(async (req, res) => {
  
  // Find all orders and sort by creation date descending
  const orders = await Order.find({})
    .populate('user')
    .populate('items.product')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(orders);
});

// 🔹 Update Order
const updateOrder = expressAsyncHandler(async(req,res)=>{
  const {order_status, payment_status,updated_mobile_no, shipping_address} = req.body;
  const orderId = req.params.orderId;

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      order_status,
      payment_status,
      updated_mobile_no,
      shipping_address,
      updatedAt: Date.now() // Update the timestamp
    },
    { new: true }
  );
  
  if (!updatedOrder) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Order not found" });
  }

  res.status(StatusCodes.OK).json({ message: "✅ Order updated successfully", order: updatedOrder });
})

module.exports = {
  getAllUsers,
  addProduct,
  getAllOrders,
  updateOrder,
  updateProduct,
  deleteProduct
};
