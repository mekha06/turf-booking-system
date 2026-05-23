const express = require("express");

const {
  createSlot,
  getSlotsByTurf,
  generateSlots,
  searchAvailableSlots,
  updateSlot,
  deleteSlot,
} = require("../controllers/slotController");

const {
  protect,
  ownerOrAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Create Single Slot
router.post(
  "/",
  protect,
  ownerOrAdmin,
  createSlot
);

// Generate Multiple Slots
router.post(
  "/generate",
  protect,
  ownerOrAdmin,
  generateSlots
);

// Search available slots
router.get("/search", searchAvailableSlots);

router.put(
  "/:id",
  protect,
  ownerOrAdmin,
  updateSlot
);

router.delete(
  "/:id",
  protect,
  ownerOrAdmin,
  deleteSlot
);

// Get Slots By Turf
router.get(
  "/:turfId",
  getSlotsByTurf
);

module.exports = router;