"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupSockets;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Message_1 = __importDefault(require("../models/Message"));
function setupSockets(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    });
    // Middleware for Socket Authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            socket.user = decoded;
            next();
        }
        catch (err) {
            next(new Error('Authentication error'));
        }
    });
    const onlineUsers = new Map(); // userId -> socketId
    io.on('connection', (socket) => {
        const userId = socket.user.id;
        console.log(`User connected: ${userId}`);
        // Map user to socket
        onlineUsers.set(userId, socket.id);
        // Join a room based on userId for private messages
        socket.join(userId);
        socket.on('send_message', async (data) => {
            try {
                const { receiverId, content, bookingId } = data;
                // Save message to DB
                const message = await Message_1.default.create({
                    sender: userId,
                    receiver: receiverId,
                    content,
                    booking: bookingId
                });
                // Emit to receiver's room
                io.to(receiverId).emit('receive_message', message);
            }
            catch (error) {
                console.error('Message error:', error);
            }
        });
        socket.on('update_location', (data) => {
            // Data expected: { bookingId, customerId, lat, lng }
            // The labour emits this, the customer receives it
            const { customerId, lat, lng, bookingId } = data;
            io.to(customerId).emit('location_update', { lat, lng, bookingId });
        });
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${userId}`);
            onlineUsers.delete(userId);
        });
    });
}
