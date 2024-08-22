// utils/notificationUtils.js
const Notification = require('../models/Notification');

exports.sendNotification = async (userId, message) => {
  const notification = new Notification({
    user: userId,
    message,
  });

  await notification.save();
};
