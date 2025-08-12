const User = require('../Models/User');
const { sendSuccess, sendError } = require('../utils/responseFormatter');
const generateToken = require('../utils/tokenGeneration');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserController {
  async register(req, res) {
    try {
      const user = new User(req.body);
      await user.save();

      sendSuccess(res, "User registered successfully", user);
    } catch (err) {
      console.error("Registration error:", err);
      sendError(res, "User registration failed", err.code, err.message);
    }
  }

  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return sendError(res, "Invalid credentials", 401);
      }

      const isPasswordValid = await user.comparePassword(req.body.password, user.password);
      if (!isPasswordValid) {
        return sendError(res, "Invalid credentials", 401);
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
      sendError(res, "Login failed", err.code, err.message);
    }
  }

  async promoteUser(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const validRoles = ['user', 'manager', 'admin'];
      if (!validRoles.includes(role)) {
        return sendError(res, "Invalid role", 400);
      }

      const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });
      if (!updatedUser) {
        return sendError(res, "User not found", 404);
      }

      sendSuccess(res, "User Promoted", updatedUser);
    } catch (err) {
      return sendError(res, "Server Error", 500, err.message);
    }
  }

  // async googleLogin(req, res) {
  //   const { token } = req.body;
  //   if (!token) return sendError(res, "Token is required", 400);

  //   try {
  //     const ticket = await client.verifyIdToken({
  //       idToken: token,
  //       audience: process.env.GOOGLE_CLIENT_ID,
  //     });

  //     const payload = ticket.getPayload();
  //     const { email, name, picture, sub: googleId } = payload;

  //     let user = await User.findOne({ email });

  //     if (!user) {
  //       user = new User({ name, email, googleId, avatar: picture });
  //       await user.save();
  //     }

  //     // Optionally generate your auth token here (JWT or similar)
  //     const authToken = generateToken(user);

  //     return sendSuccess(res, "User logged in via Google", { user, token: authToken });
  //   } catch (error) {
  //     return sendError(res, "Invalid Google token", 401);
  //   }
  // }
}

module.exports = new UserController();
