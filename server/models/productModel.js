const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    // Corresponds to product_id (using _id)

    product_name: {
        type: String,
        required: true,
        trim: true
    },
    product_price: {
        type: Number, // Use Number for price (which is like FLOAT/DECIMAL)
        required: true
    },
    product_quantity: {
        type: Number // Quantity for a single purchase item
    },
    quantity_measure: {
        type: String // e.g., "kg", "grams", "pieces"
    },
    total_quantity: {
        type: Number, // Total stock available
        default: 0
    },
    product_category: {
        type: String
    },
    product_description: {
        type: String
    },
    product_image: {
        type: [String] // Store an array of image URLs (instead of a JSON string in SQL)
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;