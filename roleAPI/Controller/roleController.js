const db = require("../data/file.js");

class UserController {
  async getAllUsers(req, res, next) 
  {
    try {
    const users = await db.getAllUsers();
    res.json(users);
    } catch (err) 
    {
      next(err); 
    }
  }

  async getUserById(req, res, next) 
  {
    try {
      const id = parseInt(req.params.id);
      const user = await db.getUserById(id);
      if (user) 
        {
        res.json(user);
      } else 
        {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      next(err);
    }
  }

  async addUser(req, res, next) {
    try {
      const user = req.body;
      const users = await db.getAllUsers();

      user.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;

      await db.addUser(user);

      res.status(201).json({ message: "User registered", user });
    } catch (err) 
    {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const id = parseInt(req.params.id);

      const success = await db.updateUser(id, req.body);

      if (success) {
        res.json({ message: "User updated" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const user = await db.getUserById(id);
      if (!user) 
        {
        return res.status(404).json({ message: "User not found" });
      }

      await db.deleteUser(id);
    
      res.json({ message: "User deleted", user });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
