const express = require("express");
const router = express.Router();
const {
  getAllUsers,getUserById,addUser,updateUser,deleteUser} =  require("../Controller/userController.js");

router.use(express.json());

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", addUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
