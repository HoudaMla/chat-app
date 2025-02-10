const { addUser, removeUser } = require('../src/Chat/ChatController'); 
const Chat = require('../src/Chat/ChatModel'); 

const connectedUsers = new Map(); 

module.exports.setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(' Un utilisateur s\'est connecté avec l\'ID:', socket.id);

        socket.on('user-connected', (username) => {
            console.log(` ${username} s'est connecté avec le socket ID: ${socket.id}`);
            socket.username = username;
            connectedUsers.set(username, socket.id);  

            io.emit('update-users', Array.from(connectedUsers.keys()));  
        });
        
        socket.on('sendChat', async (data) => {
            const { sender, receiver, message, isGroup } = data;
            console.log(' Message reçu:', sender, receiver, message);
            
            const newChat = new Chat({
                sender, 
                receiver: receiver === 'all' ? 'all' : Array.isArray(receiver) ? receiver : [receiver],  
                message
            });
        
            try {
                await newChat.save();

                if (isGroup) {
                    console.log("Envoi du message à tous les utilisateurs.");
                    connectedUsers.forEach((socketId, username) => {
                        if (username !== sender) {
                            io.to(socketId).emit('receiveChat', newChat);
                        }
                    });
                } else {
                    const receiverSocketId = connectedUsers.get(receiver);
                    if (receiverSocketId) {
                        console.log(` Envoi du message privé à ${receiver}`);
                        io.to(receiverSocketId).emit('receiveChat', newChat);
                    } else {
                        console.log('Utilisateur non connecté:', receiver);
                    }
                }

                socket.emit('receiveChat', newChat);
            } catch (error) {
                console.error(' Erreur lors de l\'enregistrement du message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(` ${socket.username} s'est déconnecté`);
            connectedUsers.delete(socket.username);  
            io.emit('update-users', Array.from(connectedUsers.keys()));  
        });
    });
};
