const Chat = require('./ChatModel'); 


var getChat = async (req, res) => {
    try {
        const { user1, user2 } = req.params;

        const messages = await Chat.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

var createChat = async (req, res) => {
    try {
        const { sender, receiver, chat } = req.body;
        if (!sender || !receiver || !chat) {
            return res.status(400).json({ error: "User and chat fields are required" });
        }

        const newChat = new Chat({ sender, receiver, chat });
        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        console.error("Error saving chat:", error.message, "\nStack Trace:", error.stack);
        res.status(500).json({ error: "Erreur lors de l'enregistrement du chat", details: error.message });
    }
};

const getGroupChat = (req, res, next) => {
    Chat.find({ receiver: "all" }) 
        .then(chats => {
            if (!chats || chats.length === 0) {
                return res.status(404).json({
                    message: "No group chat found",
                });
            }
            console.log(chats);
            res.status(200).json(chats);
        })
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving group chat",
                error: err
            });
            console.log(err);
        });
};

module.exports = { getChat, createChat, getGroupChat };
