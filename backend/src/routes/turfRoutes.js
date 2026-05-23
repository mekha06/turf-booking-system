const express = require("express");

const {
  createTurf,
  getTurfs,
  getMyTurfs,
  updateTurf,
  deleteTurf,
} = require("../controllers/turfController");

const {
  protect,
  ownerOrAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Create Turf
router.post("/", protect, ownerOrAdmin, createTurf);

router.get(
  "/my-turfs",
  protect,
  ownerOrAdmin,
  getMyTurfs
);

// Update Turf
router.put(
  "/:id",
  protect,
  ownerOrAdmin,
  updateTurf
);

// Delete Turf
router.delete(
  "/:id",
  protect,
  ownerOrAdmin,
  deleteTurf
);

// Get All Turfs
router.get("/", getTurfs);

module.exports = router;