// This is not exported as a separate model; it's just a schema used within OrderSchema
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    total_price: { 
        type: Number,
        required: true
    },
    // The total_price logic (quantity * price) will be done in the application logic (Express controller)
});


const OrderSchema = new mongoose.Schema({
    // Corresponds to order_id (using _id)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the 'User' model
        required: true
    },
    // The embedded order items:
    items: [OrderItemSchema], // Array of documents structured by OrderItemSchema

    total_amount: {
        type: Number,
        required: true
    },
    order_status: {
        type: String,
        default: 'pending'
    },
    payment_status: {
        type: String,
        default: 'unpaid'
    },
    payment_method: {
        type: String
    },
    updated_mobile_no: {
        type: String
    },
    shipping_address: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now 
    }
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;