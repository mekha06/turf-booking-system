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

// Public Route - Get All Turfs
router.get("/", getTurfs);

// Owner Route - Get My Turfs
router.get(
  "/my-turfs",
  protect,
  ownerOrAdmin,
  getMyTurfs
);

// Owner Route - Create Turf
router.post("/", protect, ownerOrAdmin, createTurf);

// Owner Route - Update Turf
router.put(
  "/:id",
  protect,
  ownerOrAdmin,
  updateTurf
);

// Owner Route - Delete Turf
router.delete(
  "/:id",
  protect,
  ownerOrAdmin,
  deleteTurf
);

module.exports = router;