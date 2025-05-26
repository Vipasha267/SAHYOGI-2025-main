const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware to verify JWT tokens and authenticate requests
 * 
 * This middleware:
 * 1. Extracts the token from the Authorization header
 * 2. Verifies the token using the JWT_SECRET
 * 3. Adds the decoded user data to the request object
 * 4. Handles various error cases with appropriate responses
 */
const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    console.log('Token received:', authHeader); // Debugging line to check token
    if (!authHeader) {
      return res.status(401).json({ message: 'Access denied. No token provided' });
    }
    
    // Extract token (remove Bearer prefix if present)
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;
      
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user data to request
      req.user = decoded;
      
      // Continue to the next middleware/route handler
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please log in again' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      } else {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Token validation failed' });
      }
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

/**
 * Middleware to check if user has a specific role
 * 
 * @param {string|string[]} roles - Role or array of roles allowed to access the route
 * @returns {function} Middleware function
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Convert single role to array for consistent handling
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    // Check if user has one of the required roles
    if (req.user.authorType && allowedRoles.includes(req.user.authorType)) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Insufficient permissions' });
    }
  };
};

// Optional middleware to check ownership (useful for updating user-specific resources)
const checkOwnership = (req, res, next) => {
  const resourceId = req.params.id;
  const userId = req.user._id;
  
  if (resourceId === userId) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. You do not own this resource' });
  }
};

module.exports = {
  verifyToken,
  checkRole,
  checkOwnership
};