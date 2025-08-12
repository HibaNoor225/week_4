const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController');
const  verifyToken  = require('../middleware/authMiddleware');
const  checkPermission  = require('../middleware/roleMiddleware');
const authValidator  = require('../validators/userValidator');
const limit=require('../utils/limiter.js')
console.log(typeof checkPermission);

router.post('/register',authValidator.registerValidator(), authValidator.validate,authController.register);
router.post('/login',limit.loginLimiter, authValidator.loginValidator(),authValidator.validate,authController.login);
router.put('/users/:id/role',verifyToken,checkPermission('promote_users'),authController.promoteUser);

module.exports = router;
