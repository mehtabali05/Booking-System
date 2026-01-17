import jwt, { decode } from 'jsonwebtoken';
import User from '../models/User.js';

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("Auth header",authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: "No token provided, authorization denied",
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded",decoded);

    req.user = await User.findById(decoded.id).select('-password');
    // console.log("req.user authentication",req.user);
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    next(); // Move to the next middleware (authorizeRole)
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

export default authenticateUser;