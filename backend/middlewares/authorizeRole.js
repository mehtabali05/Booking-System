// backend/middlewares/authorizeRole.js

/**
 * Role-based access control middleware
 * Usage: authorizeRole("parent") or authorizeRole("caretaker")
 */ 
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied: insufficient permissions",
        });
      }
      next();
    };
  };
  
  export default authorizeRole;
  