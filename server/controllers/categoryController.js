const express = require("express");
const connectDB=require('../db/connectDB.js');
const expressAsyncHandler = require("express-async-handler");
const uploadImage = require("../middleware/uploadMiddleware");
const userRoutes = express.Router();
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
// const { sendMail } = require("../middleware/sendMail");
dotenv.config();
// const getCategories = expressAsyncHandler(async (req, res) => {
//     console.log("logn", req.body.data.email.toLowerCase());
//     const db = await connectDB(); // ✅ Get the pool first
//     const [rows] =await db.query(
//       `SELECT * FROM Users WHERE email = ?`, 
//       [req.body.data.email.toLowerCase()]
//     );
//     console.log(rows[0])
//     const user = rows[0];
//     if (!user) {
//       res.status(403).send({ error: "user not found" });
//     }
//     if (bcrypt.compareSync(req.body.data.password, user.password)) {
//       const token = generateToken(user);
//       res.status(201).json({ token, user });
//       return;
//     }
//     res.status(401).send({ error: "Invalid Password" });
//   });
// 🔹 Get All Products
const getAllProducts = expressAsyncHandler(async (req, res) => {
    const db = await connectDB();
    const [products] = await db.query(`SELECT * FROM Products`);
    res.status(StatusCodes.OK).json(products);
  });
  
  // 🔹 Get Single Product (optional)
  const getSingleProduct = expressAsyncHandler(async (req, res) => {
    const db = await connectDB();
    const [rows] = await db.query(`SELECT * FROM Products WHERE product_id = ?`, [req.params.id]);
    const product = rows[0];
  
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Product not found" });
    }
  
    res.status(StatusCodes.OK).json(product);
  });

const getCartItems=expressAsyncHandler(async(req,res)=>{
  const db = await connectDB();
  const[cartItems]=await db.query(`select * from Products p join cart_items c on p.product_id=c.product_id where c.user_id=?
`,[req.params.userId]);
  res.status(StatusCodes.OK).json(cartItems);
})

const deleteCartItem=expressAsyncHandler(async(req,res)=>{
  const db = await connectDB();
  const[cartItems]=await db.query(`delete from cart_items where cart_item_id=? and user_id=?
`,[req.params.cart_item_id,req.params.user_id]);
  res.status(StatusCodes.OK).json(cartItems);
})

const updateCartItem=expressAsyncHandler(async(req,res)=>{
  const db=await connectDB();
  const [cartItems]=await db.query(`update cart_items
    set quantity=?
    where user_id=? and cart_item_id=?;`,[req.body.quantity,req.params.user_id,req.params.cart_item_id]);
  res.status(StatusCodes.OK).json(cartItems);
})

const addProductCart=expressAsyncHandler(async(req,res)=>{
  const db = await connectDB();
  const{
    user_id,
    product_id,
    quantity
  }=req.body;
  const [existing] = await db.query(
    `SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?`,
    [user_id, product_id]
  );

  if (existing.length > 0) {
    // Product already in cart
    return res.status(409).json({
      message: "Product already added to cart",
      cartItem: existing[0],
    });
  }
  const[result]=await db.query(`INSERT INTO cart_items(user_id,product_id,quantity) values(?,?,?)`,[user_id,product_id,quantity]);
  const newCartitem = {
    cart_item_id: result.insertId,
    user_id,
    product_id,
    quantity
  };

  res.status(201).json({
    message: "✅ Product added successfully",
    cartItem: newCartitem,
  });
})
module.exports={getAllProducts,getSingleProduct,getCartItems,addProductCart,deleteCartItem,updateCartItem}