const express = require("express");

const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookingAnalytics,
  getOwnerBookings,
  getOwnerAnalytics,
} = require("../controllers/bookingController");

const {
  protect,
  ownerOrAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Create Booking
router.post("/", protect, createBooking);

// Booking Analytics
router.get(
  "/analytics",
  protect,
  ownerOrAdmin,
  getBookingAnalytics
);

// Get My Bookings
router.get("/my", protect, getMyBookings);

router.get(
  "/owner",
  protect,
  ownerOrAdmin,
  getOwnerBookings
);

router.get(
  "/owner/analytics",
  protect,
  ownerOrAdmin,
  getOwnerAnalytics
);

// Cancel Booking
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;