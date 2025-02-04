const Chat = require('./ChatModel'); // Ensure correct model import

// Get all chats
var getChat = async (req, res) => {
    try {
        const chats = await Chat.find().sort({ timestamp: 1 });
        res.json(chats);
    } catch (error) {
        console.error("Error fetching chats:", error.message, "\nStack Trace:", error.stack);
        res.status(500).json({ error: "Erreur lors de la récupération des chats", details: error.message });
    }
};

// Save a chat via API REST
var createChat = async (req, res) => {
    try {
        const { user, chat } = req.body;
        if (!user || !chat) {
            return res.status(400).json({ error: "User and chat fields are required" });
        }

        const newChat = new Chat({ user, chat });
        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        console.error("Error saving chat:", error.message, "\nStack Trace:", error.stack);
        res.status(500).json({ error: "Erreur lors de l'enregistrement du chat", details: error.message });
    }
};

module.exports = { getChat, createChat };
