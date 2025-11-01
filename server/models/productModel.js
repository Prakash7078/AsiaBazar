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
    product_size: {
        type: Number // Quantity for a single purchase item
    },
    quantity_measure: {
        type: String // e.g., "kg", "grams", "pieces"
    },
    total_products: {
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
        type: [String],
        default: ['../../client/public/Images/asiabazar.png']
      },      
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: { type: Boolean, default: false },
    outOfStock: { 
        type: Boolean, 
        default: false 
    }

});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;