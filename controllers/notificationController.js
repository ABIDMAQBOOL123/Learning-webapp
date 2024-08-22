const Notification = require('../models/Notification');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync');
const notificationService = require('../services/notificationService');

exports.createNotification = wrapAsync(async (req, res) => {
  const { userId, message } = req.body;

  
  if (!userId) {
    throw new ExpressError(400, 'User ID is required');
  }

  const notification = new Notification({
    user: userId,
    message,
  });

  await notification.save();
  console.log('Notification created in database:', notification);
  notificationService.sendNotification(userId, message);

  res.status(201).json(notification);
});

exports.getUserNotifications = wrapAsync(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notifications);
});

exports.markAsRead = wrapAsync(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    throw new ExpressError(404, 'Notification not found');
  }

  if (notification.user.toString() !== req.user.id) {
    throw new ExpressError(403, 'Not authorized');
  }

  notification.read = true;
  await notification.save();

  res.json(notification);
});
