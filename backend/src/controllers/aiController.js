const asyncHandler = require("express-async-handler");

const Booking = require("../models/Booking");
const Slot = require("../models/Slot");

// AI SLOT RECOMMENDATIONS
const getSlotRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const userBookings = await Booking.find({
    user: userId,
  })
    .populate("turf", "name sportType location pricePerHour")
    .populate("slot", "date startTime endTime");

  let preferredSport = null;

  if (userBookings.length > 0) {
    const sportCount = {};

    userBookings.forEach((booking) => {
      const sport = booking.turf?.sportType;

      if (sport) {
        sportCount[sport] = (sportCount[sport] || 0) + 1;
      }
    });

    preferredSport = Object.keys(sportCount).sort(
      (a, b) => sportCount[b] - sportCount[a]
    )[0];
  }

  const availableSlots = await Slot.find({
    isBooked: false,
  })
    .populate("turf", "name sportType location pricePerHour")
    .limit(20);

  let recommendedSlots = availableSlots;

  if (preferredSport) {
    recommendedSlots = availableSlots.filter(
      (slot) => slot.turf?.sportType === preferredSport
    );
  }

  if (recommendedSlots.length === 0) {
    recommendedSlots = availableSlots;
  }

  const formattedRecommendations = recommendedSlots
  .slice(0, 5)
  .map((slot) => {
    const turf = slot.turf;

    let reason = "Recommended because this slot is currently available";

    if (preferredSport && turf?.sportType === preferredSport) {
      reason = `Matches your preferred sport: ${preferredSport}`;
    }

    if (slot.startTime >= "18:00") {
      reason = "Popular evening slot for after-work games";
    } else if (
      slot.startTime >= "06:00" &&
      slot.startTime <= "09:00"
    ) {
      reason = "Great morning fitness timing";
    } else if (turf?.pricePerHour < 1000) {
      reason = "Budget-friendly slot recommendation";
    }

    return {
      slotId: slot._id,
      turfId: turf?._id,
      turfName: turf?.name,
      sportType: turf?.sportType,
      location: turf?.location,
      pricePerHour: turf?.pricePerHour,
      date: slot.date,
      time: `${slot.startTime} - ${slot.endTime}`,
      reason,
    };
  });
  res.status(200).json({
    success: true,
    preferredSport,
    count: formattedRecommendations.length,
    recommendations: formattedRecommendations,
  });
});

module.exports = {
  getSlotRecommendations,
};