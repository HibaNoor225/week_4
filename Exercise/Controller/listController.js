const db = require("../data/file.js");

class listController {
  async readTask(req, res, next) {
    try {
        const tasks = await db.getAllTasks();
        res.json(tasks);
    } catch (err)
     {
      next(err); 
    }
  }

  async readTaskById(req, res, next) {
    try 
    {
      const id = parseInt(req.params.id);
      const task = await db.getAllTasksById(id);

      if (task) 
        {
        res.json(task);
      } else 
        {
        res.status(404).json({ message: "Task not found" });
      }
    } catch (err) 
    {
      next(err);
    }
  }

  async createTask(req, res, next)
   {
    try {
      const task = req.body;
      const tasks = await db.getAllTasks();
      task.id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

      await db.addTask(task);
      res.status(201).json({ message: "Task Added", task });
    } catch (err) {
      next(err);
    }
  }

  async updateTask(req, res, next) 
  {
    try {
      const id = parseInt(req.params.id);
      const success = await db.updateTask(id, req.body);

      if (success) {
        res.json({ message: "Task updated" });
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    } catch (err) {
      next(err);
    }
  }

  async deleteTask(req, res, next)
   {
    try {
      const id = parseInt(req.params.id);
      const task = await db.getTaskById(id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      await db.deleteTask(id);
      res.json({ message: "Task deleted", task });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new listController();
