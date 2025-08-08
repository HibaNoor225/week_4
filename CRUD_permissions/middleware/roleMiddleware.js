const roles = require('../Models/roles');
const { sendError } = require('../utils/responseFormatter'); 

const checkPermission = (requiredPermission) => {
  return (req, res, next) => 
    {
    const userRole = req.info.role; 

    if (!userRole) {
sendError(res,"User role not found",403)
     
    }

    const permissions = roles[userRole];

    if (!permissions || !permissions.includes(requiredPermission)) {
        sendError(res,"Permission denied",403)
    }

    next(); // User has permission
  };
}
module.exports = 
  checkPermission;

