const { addUser, removeUser } = require('../src/Chat/ChatController'); 
const Chat = require('../src/Chat/ChatModel'); 

const connectedUsers = new Map(); // Garde une trace des utilisateurs connectés

module.exports.setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('Un utilisateur s\'est connecté');

        socket.on('user-connected', (username) => {
            console.log(`${username} connected with socket ID: ${socket.id}`);
            socket.username = username;
            connectedUsers.set(username, socket.id);  // Correctly store the username and socket ID
            io.emit('update-users', Array.from(connectedUsers.keys()));  // Emit updated user list
        });
        

        socket.on('sendChat', async (data) => {
            const { sender, receiver, message, isGroup } = data;
            console.log('Received chat message:', sender, receiver, message);
            
            const newChat = new Chat({
                sender, 
                receiver: receiver === 'all' ? 'all' : Array.isArray(receiver) ? receiver : [receiver],  // Ensure 'all' or single user
                message
            });
        
            try {
                await newChat.save();
        
                if (receiver === 'all') {
                    connectedUsers.forEach((socketId, username) => {
                        if (socketId !== sender) {
                            io.to(socketId).emit('receiveChat', newChat);
                        }
                    });
                } else {
                    const receiverSocketId = connectedUsers.get(receiver);
                    if (receiverSocketId) {
                        io.to(receiverSocketId).emit('receiveChat', newChat);
                    } else {
                        console.log('Receiver not connected');
                    }
                }
        
                socket.emit('receiveChat', newChat);
            } catch (error) {
                console.error('Error saving chat message:', error);
            }
        });
        
        
        

        socket.on('disconnect', () => {
            console.log(`${socket.username} disconnected`);

            connectedUsers.delete(socket.username);  // Retirer l'utilisateur de la Map

            io.emit('update-users', Array.from(connectedUsers.keys()));  // Mettre à jour la liste des utilisateurs
        });
        
    });
};
