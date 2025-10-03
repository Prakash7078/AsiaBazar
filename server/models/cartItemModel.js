const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    // Corresponds to cart_item_id (using _id)

    user: {
        type: mongoose.Schema.Types.ObjectId, // The MongoDB Foreign Key
        ref: 'User', // References the 'User' model
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId, // The MongoDB Foreign Key
        ref: 'Product', // References the 'Product' model
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    added_at: {
        type: Date,
        default: Date.now
    }
    // Note: The `select * from Products p join cart_items c...` SQL logic will be handled 
    // in Node.js using the Mongoose `.populate('product')` method.
});

const CartItem = mongoose.model('CartItem', CartItemSchema);
module.exports = CartItem;