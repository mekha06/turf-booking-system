const jwt = require("jsonwebtoken");
const User = require("../models/User");

// PROTECT ROUTES
const protect = async (req, res, next) => {
  let token;

  try {
    // Check authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user data without password
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Token failed",
    });
  }
};

// OWNER OR ADMIN ACCESS
const ownerOrAdmin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "admin" ||
      req.user.role === "owner")
  ) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Owner/Admin access only",
    });
  }
};

module.exports = {
  protect,
  ownerOrAdmin,
};