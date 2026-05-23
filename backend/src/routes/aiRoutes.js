const express = require("express");

const {
  getSlotRecommendations,
} = require("../controllers/aiController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/recommendations",
  protect,
  getSlotRecommendations
);

module.exports = router;