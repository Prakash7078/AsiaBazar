const express = require("express");
const connectDB=require('../db/connectDB.js');
const expressAsyncHandler = require("express-async-handler");
const uploadImage = require("../middleware/uploadMiddleware");
const userRoutes = express.Router();
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
const CartItem = require("../models/cartItemModel.js");
const Order = require("../models/orderModel.js");
// const { sendMail } = require("../middleware/sendMail");
dotenv.config();
// 🔹 Add Customer Order
const addCustomerOrder = expressAsyncHandler(async(req,res)=>{
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
    
    // Combine shipping address details
    const shipping_address = `${address}, ${city}, ${state}, ${zipCode}`;
    const updated_mobile_no = phone;

    // Map cart items to the embedded structure required by the Order model
    const orderItems = cartItems.map(item => ({
        product: item?.product?._id, // Reference to Product ID
        product_name: item?.product?.product_name, // Copy product name for historical record
        quantity: item?.quantity,
        price: item?.product?.product_price, // Unit price at time of purchase
        product_size: item?.product?.product_size, // Available stock at time of purchase
        quantity_measure: item?.product?.quantity_measure, // Copy quantity measure for historical record
        product_image: item?.product?.product_image, // Copy product image for historical record
        product_category: item?.product?.product_category, // Copy category for historical record
        product_description: item?.product?.product_description, // Copy description for historical record
    }));

    try{
        // Create the Order document with embedded items
        const newOrder = await Order.create({
            user: user_id,
            total_amount: totalAmount,
            payment_method: paymentIntent,
            payment_status: paymentStatus,
            updated_mobile_no,
            shipping_address,
            items: orderItems, // Embedded order items
        });
        
        // Delete the cart items after successful order creation
        await CartItem.deleteMany({ user: user_id });

        // Final response
        res.status(201).json({
            message: "✅ Order placed successfully",
            orderId: newOrder._id,
        });
    }
    catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ message: "❌ Failed to place order" });
    }
});

// 🔹 Get User Orders
const getUserOrders = expressAsyncHandler(async(req,res)=>{
    const userId = req.params.user_id;

    // Find all orders for the user, sort by creation date
    const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean();
    
    res.status(200).json(orders);
});

module.exports={addCustomerOrder,getUserOrders}