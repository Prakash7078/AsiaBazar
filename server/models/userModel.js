const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // Corresponds to user_id (MongoDB automatically uses _id as the primary key)
    
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    mobile_no: {
        type: String,
        // No 'unique' constraint here, as users might not provide one, but good for searching
    },
    address: {
        type: String
    },
    admin: {
        type: Boolean,
        default: false
    },
    // Corresponds to created_at
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
    // Note: The `select * from Users;` query doesn't create collections, it's a SQL command.
});

const User = mongoose.model('User', UserSchema);
module.exports = User;