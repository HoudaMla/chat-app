const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    sender: { 
        type: String, 
        required: true 
    },
    receiver: { 
        type: [String], 
        required: true 
    },  
    message: { 
        type: String, 
        required: true 
    },
    isGroup: { 
        type: Boolean, 
        default: false 
    },  
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Chat', ChatSchema);
