const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  role: String,
  createdAt: Date
});

module.exports = mongoose.model('User', userSchema);
