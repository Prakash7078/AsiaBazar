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
        paymentIntent,
        paymentStatus,
        totalAmount,
      } = formData;
    const shipping_address = `${address}, ${city}, ${state}, ${zipCode}`;
    const updated_mobile_no = phone;

    try{
        const[result]=await db.query(`INSERT INTO orders(user_id,total_amount,payment_method,payment_status,updated_mobile_no,shipping_address) values(?,?,?,?,?,?)`,[user_id,totalAmount,paymentIntent,paymentStatus,updated_mobile_no,shipping_address]);
        console.log("result",result);
        const orderId=result?.insertId;
        console.log("orderId",orderId);
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
    }
    catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ message: "❌ Failed to place order" });
    }
    
    
})

const getUserOrders=expressAsyncHandler(async(req,res)=>{
    const db=await connectDB();
    const userId=req.params.user_id;
    console.log("userId",userId);
    const [orders]=await db.query(`SELECT * FROM orders WHERE user_id=? ORDER BY order_id DESC`,[userId]);
    console.log("orders",orders);
    for(const order of orders){
        const [items]=await db.query(`SELECT oi.*, p.product_name, p.product_image FROM order_items oi JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id=?`,[order.order_id]);
        order.items=items;
    }
    res.status(200).json(orders);
})

module.exports={addCustomerOrder,getUserOrders}