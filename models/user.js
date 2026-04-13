const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'journalist', 'admin'],
        default: 'user'
    },
    profilePicture: {
        type: String,
        default: ''
    },
     assignedChannel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        default: null
    },
    phone: {
        type: String,
    },
    
   fcmToken: {
    type: String
},
    preferences: {
    categories: {
        type: [String], 
        default: []
    },
    frequency: {
        type: String,
        enum: ["immediate", "hourly", "daily"],
        default: "immediate"
    },
    notificationsEnabled: {
        type: Boolean,
        default: true
    }
},
    
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema, 'users');