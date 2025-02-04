const Chat = require('../src/Messages/ChatModel');

module.exports.setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('Un utilisateur s\'est connecté');

        // Recevoir et diffuser les Chats
        socket.on('sendChat', async (data) => {
            const { user, Chat } = data;
            
            // Sauvegarde dans MongoDB
            const newChat = new Chat({ user, Chat });
            await newChat.save();

            // Diffuser le Chat à tous les utilisateurs
            io.emit('receiveChat', newChat);
        });

        socket.on('disconnect', () => {
            console.log('Un utilisateur s\'est déconnecté');
        });
    });
};
