const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const notificationController = require('../../controllers/notificationController');
const { check } = require('express-validator');
const wrapAsync = require('../../utils/wrapAsync');

// Create a new notification
router.post(
  '/',
  [
    auth,
    [
      check('message', 'Message is required').not().isEmpty(),
      check('userId', 'User ID is required').not().isEmpty(),
    ],
  ],
  notificationController.createNotification
);

// Get all notifications for the authenticated user
router.get('/', auth, notificationController.getUserNotifications);

// Mark a notification as read
router.patch('/read/:id', auth,notificationController.markAsRead);

module.exports = router;
