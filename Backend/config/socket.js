const { addUser, removeUser } = require('../src/Messages/ChatController'); 
const Chat = require('../src/Messages/ChatModel'); 

const connectedUsers = new Map(); 

module.exports.setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('Un utilisateur s\'est connecté');

        socket.on('user-connected', (username) => {
            socket.username = username; 
            connectedUsers.set(username, socket.id);

            io.emit('update-users', Array.from(connectedUsers.keys())); 
        });

        socket.on('sendChat', async (data) => {
            const { sender, receiver, message } = data;
            console.log('Received chat message:', sender, receiver, message);
        
            const newChat = new Chat({ sender, receiver, message });
            await newChat.save();
        
            const receiverSocketId = connectedUsers.get(receiver);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receiveChat', newChat);
            } else {
                console.log('Receiver not connected');
            }
        
            socket.emit('receiveChat', newChat);
        });
        

        socket.on('disconnect', () => {
            console.log(`${socket.username} disconnected`);
        
            connectedUsers.delete(socket.username);
        
            io.emit('update-users', Array.from(connectedUsers.keys()));
        });
        
    });
};
