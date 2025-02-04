const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    user: { type: String, required: true },
    chat: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);
