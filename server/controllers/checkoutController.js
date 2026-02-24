const express = require("express");
const connectDB=require('../db/connectDB.js');
const expressAsyncHandler = require("express-async-handler");
const uploadImage = require("../middleware/uploadMiddleware");
const userRoutes = express.Router();
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
const CartItem = require("../models/cartItemModel.js");
const Order = require("../models/orderModel.js");
const {sendMail} = require("../middleware/sendMail");
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
        deliveryType,
    } = formData;
    
    // Combine shipping address details
    const shipping_address = `${address}, ${city}, ${state}, ${zipCode}`;
    const updated_mobile_no = phone;

    // Map cart items to the embedded structure required by the Order model
    const orderItems = cartItems.map(item => ({
        product: item?.product?._id, // Reference to Product ID
        product_name: item?.product?.product_name, // Copy product name for historical record
        quantity: item?.quantity,
        total_price: item?.product?.product_price*item?.quantity, // Unit price at time of purchase
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
            deliveryType: deliveryType,
            updated_mobile_no,
            shipping_address,
            items: orderItems, // Embedded order items
        });
        
        // Delete the cart items after successful order creation
        await CartItem.deleteMany({ user: user_id });
        try{
            const message = `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <div style="background-color: #16a34a; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 26px;">🛒 Asia Bazzar</h1>
                <p style="color: #dcfce7; margin: 6px 0 0;">Order Confirmation</p>
                </div>

                <!-- Body -->
                <div style="padding: 30px;">
                <h2 style="color: #1f2937;">Thank you for your order! 🎉</h2>
                <p style="color: #6b7280; font-size: 15px;">We've received your order and it's being prepared.</p>

                <!-- Order Info Box -->
                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <p style="margin: 0 0 10px; color: #374151;"><strong>📦 Order ID:</strong> ${firstName}</p>
                    <p style="margin: 0 0 10px; color: #374151;"><strong>💰 Total Amount:</strong> $${newOrder.total_amount}</p>
                    <p style="margin: 0 0 10px; color: #374151;"><strong>🚗 Delivery Type:</strong> ${newOrder.deliveryType}</p>
                    <p style="margin: 0; color: #374151;"><strong>💳 Payment Status:</strong> ${newOrder.payment_status}</p>
                </div>

                <!-- Pickup Notice -->
                <div style="background-color: #fefce8; border-left: 4px solid #facc15; padding: 15px; border-radius: 4px; margin: 20px 0;">
                    <p style="margin: 0; color: #92400e; font-size: 15px;">
                    ⚠️ <strong>Pickup Order:</strong> Please tell your <strong>${String(phone).slice(-3)}</strong> at the counter and pay when you pick up your order.
                    </p>
                </div>

                <p style="color: #6b7280; font-size: 14px;">If you have any questions, feel free to contact us.</p>
                </div>

                <!-- Footer -->
                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 13px; margin: 0;">© 2025 Asia Bazzar. All rights reserved.</p>
                </div>

            </div>
            </body>
            </html>
            `;        
        
            await sendMail(email, message);
        }catch(err){
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Error sending email" });
        }
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
        .populate('user')
        .populate('items.product')
        .sort({ createdAt: -1 })
        .lean();
    
    res.status(200).json(orders);
});

module.exports={addCustomerOrder,getUserOrders}