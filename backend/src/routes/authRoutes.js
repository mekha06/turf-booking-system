const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const {
  registerValidation,
  loginValidation,
  validate,
} = require("../validators/authValidator");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Register Route
router.post(
  "/register",
  registerValidation,
  validate,
  registerUser
);

// Login Route
router.post(
  "/login",
  loginValidation,
  validate,
  loginUser
);

// Protected Profile Route
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected profile route accessed",
    user: req.user,
  });
});

module.exports = router;