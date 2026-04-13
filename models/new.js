const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
 
   
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true,
    },
     image: {   
        type: String,
        default: ''
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
     isBreaking: {
        type: Boolean,
        default: false
    },

    breakingPriority: {
        type: Number, 
        default: 0
    },
createdAt: {
        type: Date,
        default: Date.now,
    },
    breakingExpiresAt: {
        type: Date ,
        index: { expires: 0 }
    },
    newsType: {
        type: String,
        enum: ['National', 'International'],
    
    },
    newsCategory: {
        type: String,
        enum: ['Sports', 'Business', 'Politics', 'Entertainment', 'Technology','Health','Education','Science','World','Other'],
    
    },
    newsDeadline: { type: Date,
        index: { expires: 0 } },
    isActive: { type: Boolean, default: true },
    
}, { timestamps: true });

module.exports = mongoose.model('New', newSchema, 'news');