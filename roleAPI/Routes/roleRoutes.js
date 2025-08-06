const express = require("express");
const router = express.Router();
const userController =  require("../Controller/roleController.js");
const roleMiddleware = require('../middleware/roleValidation.js');

router.get("/users", roleMiddleware.validateRole,
  roleMiddleware.checkPermission('read'),userController.getAllUsers);
router.get("/users/:id",roleMiddleware.validateRole,
  roleMiddleware.checkPermission('read'), userController.getUserById);
router.post("/users",roleMiddleware.validateRole,
  roleMiddleware.checkPermission('create'), userController.addUser);
router.put("/users/:id",roleMiddleware.validateRole,
  roleMiddleware.checkPermission('update'), userController.updateUser);
router.delete("/users/:id",roleMiddleware.validateRole,
  roleMiddleware.checkPermission('delete'), userController.deleteUser);

module.exports = router;
