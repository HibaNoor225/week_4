const express = require("express");
const router = express.Router();
const userController =  require("../Controller/userController.js");

router.use(express.json());

// router.get("/test-error", (req, res) => {
//   throw new Error("This is a test error");
// });
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users", userController.addUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
