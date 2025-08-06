const express = require("express");
const router = express.Router();
 const {
  readTask,
  readTaskById,
  createTask,
  updateTask,
  deleteTask,
} =  require("../Controller/listController.js");

router.use(express.json());

router.get("/tasks", readTask);
router.get("/tasks/:id", readTaskById);
router.post("/tasks", createTask);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

module.exports = router;
