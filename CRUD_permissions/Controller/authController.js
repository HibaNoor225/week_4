const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseFormatter');
const  generateToken  = require('../utils/tokenGeneration'); 

class UserController {
  async register(req, res) {
    try {
      const user = new User(req.body);
      await user.save();

      sendSuccess(res, "User registered successfully", user);
    } catch (err) {
      console.error("Registration error:", err);
      sendError(res, "User registration failed",  err.code,err.message);
    }
  }

  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return error(res, "Invalid credentials", 401,err.message);
      }

      const isPasswordValid = await user.comparePassword(req.body.password, user.password);
      if (!isPasswordValid) {
        return sendError(res, "Invalid credentials", 401,err.message);
      }

      const token = generateToken(user);

      return sendSuccess(res, "Login successful", {
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (err) {
      sendError(res, "Login failed",  err.code,err.message);
    }
  }

 async promoteUser (req, res)
 {
  try {
    const { id } = req.params;
    const { role } = req.body; 

    const validRoles = ['user', 'manager', 'admin'];
    if (!validRoles.includes(role)) {

       return sendError(res, "Invalid role", 400,err.message);
    }

    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!updatedUser) {
      return sendError(res, "User not found", 404,err.message);
    
    }

    sendSuccess(res, "User Promoted", updatedUser);
  } catch (err) {
    return sendError(res, "Server Error", 500,err.message);
  }
};
}

module.exports = new UserController();
