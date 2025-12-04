const User = require('../models/User');

class UserRepository {
  async findById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      throw new Error(`Error finding user by id: ${error.message}`);
    }
  }

  async findByIdAndPopulate(id, populatePath) {
    try {
      return await User.findById(id).populate(populatePath);
    } catch (error) {
      throw new Error(`Error finding user with populate: ${error.message}`);
    }
  }

  async getByEmail(email) {
    try {
      return await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  async create(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      return await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}

module.exports = new UserRepository();