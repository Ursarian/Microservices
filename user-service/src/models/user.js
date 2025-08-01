const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],  // Add more roles if needed
        default: 'user'
    }
});
console.log('✅ User model loaded');
module.exports = mongoose.model('user', userSchema);