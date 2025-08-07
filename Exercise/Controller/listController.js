const list = require('../models/list');

class ListController {
  // GET all tasks
  async readTask(req, res, next) {
    try {
      const tasks = await list.find();
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  }

  // GET task by ID
  async readTaskById(req, res, next) {
    try {
      const task = await list.findById(req.params.id);
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (err) {
      next(err);
    }
  }
  //  create new task
  async createTask(req, res, next) {
    try {
      const newTask = new list(req.body);
      const savedTask = await newTask.save();
      res.status(201).json({ message: 'Task added', task: savedTask });
    } catch (err) {
      next(err);
    }
  }
//update task
  
  async updateTask(req, res, next) {
    try {
      const updatedTask = await list.findByIdAndUpdate(req.params.id,req.body,{ new: true } );

      if (updatedTask) {
        res.json({ message: 'Task updated', task: updatedTask });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (err) {
      next(err);
    }
  }

  // DELETE task by ID
  async deleteTask(req, res, next) {
    try {
      const deletedTask = await list.findByIdAndDelete(req.params.id);
      if (deletedTask) {
        res.json({ message: 'Task deleted', task: deletedTask });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ListController();
