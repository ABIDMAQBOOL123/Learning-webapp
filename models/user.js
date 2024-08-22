const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['admin', 'instructor', 'student', 'guest'],
    default: 'guest' // Default value set to 'guest'
  }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
