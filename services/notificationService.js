let io;

const initSocket = (serverIo) => {
  io = serverIo;
};

const sendNotification = (userId, message) => {
  if (io) {
    console.log(`Sending notification to ${userId}: ${message}`);
    io.to(userId).emit('notification', message);
  } else {
    console.log('Socket.io is not initialized');
  }
};

const sendBroadcastNotification = (message) => {
  if (io) {
    console.log(`Sending broadcast notification: ${message}`);
    io.emit('notification', message);
  } else {
    console.log('Socket.io is not initialized');
  }
};

module.exports = {
  initSocket,
  sendNotification,
  sendBroadcastNotification,
};
