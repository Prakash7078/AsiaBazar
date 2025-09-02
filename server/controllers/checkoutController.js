const express = require("express");
const connectDB=require('../db/connectDB.js');
const expressAsyncHandler = require("express-async-handler");
const uploadImage = require("../middleware/uploadMiddleware");
const userRoutes = express.Router();
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
// const { sendMail } = require("../middleware/sendMail");
dotenv.config();
const addCustomerOrder=expressAsyncHandler(async(req,res)=>{
    const db=await connectDB();
    const { formData, cartItems } = req.body;
    const {
        user_id,
        firstName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        paymentMethod,
        totalAmount,
        cardNumber,
        expiryDate,
        cvv,
        cardName
      } = formData;
    const shipping_address = `${address}, ${city}, ${state}, ${zipCode}`;
    const updated_mobile_no = phone;

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
    const shipping = 5.99;
    const total = subtotal + shipping;

    const[result]=await db.query(`INSERT INTO ORDERS(user_id,total_amount,payment_method,updated_mobile_no,shipping_address) values(?,?,?,?,?)`,[user_id,total,paymentMethod,updated_mobile_no,shipping_address]);
    const orderId=result.insertId;
    for (const item of cartItems) {
        const { product_id, quantity, product_price } = item;
        await db.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
            [orderId, product_id, quantity, product_price]
        );
    }
    
    // Final response
    res.status(201).json({
        message: "✅ Order placed successfully",
        orderId: orderId,
    });
})

module.exports={addCustomerOrder}