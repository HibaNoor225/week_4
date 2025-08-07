const User = require("../models/User");

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      next(err);
    }
  }

  async addUser(req, res, next) {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: "User registered", user });
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body,{ new: true });

      if (updatedUser) {
        res.json({ message: "User updated", updatedUser });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (deletedUser) {
        res.json({ message: "User deleted", deletedUser });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
