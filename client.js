// testClient.js
const io = require('socket.io-client');

const socket = io('http://localhost:5051');

socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
  // Authenticate with the server
  socket.emit('authenticate', { userId: '66b0633d05b2c8a883ba03ca' });
});

socket.on('notification', (message) => {
  console.log('Notification received:', message);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
