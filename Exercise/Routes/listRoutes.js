const express = require("express");
const router = express.Router();
 const listController =  require("../Controller/listController.js");
const validateTask = require("../middleware/listMiddleware.js");

router.get("/tasks", listController.readTask);

router.get("/tasks/:id", listController.readTaskById);
router.post("/tasks",validateTask, listController.createTask);
router.put("/tasks/:id", listController.updateTask);
router.delete("/tasks/:id", listController.deleteTask);

module.exports = router;
