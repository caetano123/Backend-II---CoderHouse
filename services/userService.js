// services/userService.js

const User = require('../models/User');

module.exports = {
  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  },

  async createUser(data) {
    const user = new User(data);
    return await user.save();
  },

  async getById(id) {
    return await User.findById(id).lean();
  }
};
