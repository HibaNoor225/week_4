const tasks = require("../data.js");

const readTask = (req, res) => {
  res.json(tasks);
};

const readTaskById = (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((u) => u.id === id);

  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
};

const createTask = (req, res) => {
  const task= req.body;

  task.id =tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

  tasks.push(task);
  res.status(201).json({ message: "Task created", task });
};


const updateTask = (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((u) => u.id === id);

  if (index !== -1) {
    const newTask = req.body;
    newTask.id = id;
    tasks[index] = newTask;
    res.json({ message: "Task updated", task: newTask });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
};

const deleteTask = (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((u) => u.id === id);

  if (index !== -1) {
    const deleted = tasks.splice(index, 1);
    res.json({ message: "Tasks deleted", task: deleted[0] });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
};

module.exports = {
  readTask,
  readTaskById,
  createTask,
  updateTask,
  deleteTask,
};
