const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController');
const  verifyToken  = require('../middleware/authMiddleware');
const  checkPermission  = require('../middleware/roleMiddleware');
console.log(typeof checkPermission);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/users/:id/role', verifyToken,checkPermission('promote_users'),authController.promoteUser);

module.exports = router;
