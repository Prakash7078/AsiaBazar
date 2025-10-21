const expressAsyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const uploadImage = require("../middleware/uploadMiddleware.js");
const dotenv = require("dotenv");
const Product = require("../models/productModel.js");
const CartItem = require("../models/cartItemModel.js");
const User = require("../models/userModel.js");
dotenv.config();



// 🔹 Get All Products
const getAllProducts = expressAsyncHandler(async (req, res) => {
    // Find all products
    const products = await Product.find({ isDeleted: false });
    res.status(StatusCodes.OK).json(products);
});

// 🔹 Get Single Product
const getSingleProduct = expressAsyncHandler(async (req, res) => {
  // Find product by MongoDB _id
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Product not found" });
  }

  res.status(StatusCodes.OK).json(product);
});



// 🔹 Get Cart Items (SQL JOIN equivalent)
const getCartItems=expressAsyncHandler(async(req,res)=>{
  const userId = req.params.userId;
  
  // Find cart items for the user and use populate('product') for the JOIN equivalent
  const cartItems = await CartItem.find({ user: userId })
    .populate('product') // Fills the product reference with the actual Product document
    .populate('user')
    .lean();
    
  res.status(StatusCodes.OK).json(cartItems);
});

// 🔹 Delete Cart (Empty Cart)
const deleteCart=expressAsyncHandler(async(req,res)=>{
  const userId = req.params.user_id;
  
  try{
    // Delete all cart items belonging to the user
    await CartItem.deleteMany({ user: userId });
    res.status(StatusCodes.OK).json({message:"Your cart is empty."});
  }catch(error){
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Error deleting cart items"});
  }
});

// 🔹 Delete Single Cart Item
const deleteCartItem=expressAsyncHandler(async(req,res)=>{
  const cartItemId = req.params.cart_item_id;
  const userId = req.params.user_id;

  // Find the item by _id and user, then delete it
  const result = await CartItem.findOneAndDelete({ 
      _id: cartItemId, 
      user: userId 
  });

  if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Cart item not found or does not belong to user" });
  }

  res.status(StatusCodes.OK).json({ message: "Cart item deleted successfully" });
});

// 🔹 Update Cart Item Quantity
const updateCartItem=expressAsyncHandler(async(req,res)=>{
  const cartItemId = req.params.cart_item_id;
  const userId = req.params.user_id;
  const { quantity } = req.body;

  // Find and update the quantity of a specific cart item
  const updatedItem = await CartItem.findOneAndUpdate(
    { _id: cartItemId, user: userId },
    { quantity: quantity },
    { new: true, runValidators: true }
  );

  if (!updatedItem) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Cart item not found or does not belong to user" });
  }
  
  res.status(StatusCodes.OK).json({ message: "Cart item updated successfully", cartItem: updatedItem });
});

// 🔹 Add Product to Cart
const addProductCart=expressAsyncHandler(async(req,res)=>{
  const{ user_id, product_id, quantity } = req.body;
  console.log(user_id, product_id, quantity);
  // Check if item already exists in cart
 

  const existing = await CartItem.findOne({ 
      user: user_id, 
      product: product_id 
  });

  if (existing) {
    return res.status(409).json({
      message: "Product already added to cart",
      cartItem: existing,
    });
  }
  
  // Insert new cart item
  const newCartItem = await CartItem.create({
      user: user_id,
      product: product_id,
      quantity: quantity || 1
  });

  res.status(201).json({
    message: "✅ added to cart",
    cartItem: newCartItem,
  });
});




module.exports = {
  getAllProducts,
  getSingleProduct,
  getCartItems,
  addProductCart,
  deleteCartItem,
  updateCartItem,
  deleteCart,

};

