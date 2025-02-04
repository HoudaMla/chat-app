const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const router = require('./routes/routes');
const { setupSocket } = require('./config/socket');
const connectDB = require('./config/Database');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(router);

// Connect to Database
connectDB();

// Setup Socket.io
setupSocket(io);

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
});

module.exports = { app, io };
