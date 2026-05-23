const Booking = require("../models/Booking");
const Slot = require("../models/Slot");
const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");

// CREATE BOOKING
const createBooking = asyncHandler(async (req, res) => {
  throw new AppError(
  "Direct booking is disabled. Please complete payment first.",
  400
);
  const { turf, slot } = req.body;

  // Find slot
  const existingSlot = await Slot.findById(slot);

  // Slot not found
  if (!existingSlot) {
    throw new AppError("Slot not found", 404);
  }

  // Already booked
  if (existingSlot.isBooked) {
    throw new AppError("Slot already booked", 400);
  }

  // Create booking
  const booking = await Booking.create({
    user: req.user._id,
    turf,
    slot,
  });

  // Mark slot booked
  existingSlot.isBooked = true;

  await existingSlot.save();

  res.status(201).json({
    success: true,
    message: "Booking successful",
    data: booking,
  });
});

// GET MY BOOKINGS
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id,
  })
    .populate("turf", "name location")
    .populate("slot", "date startTime endTime");

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// CANCEL BOOKING
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  // Booking not found
  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  // Check ownership
  if (booking.user.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized", 403);
  }

  // Update booking status
  booking.status = "Cancelled";

  await booking.save();

  // Free slot again
  const slot = await Slot.findById(booking.slot);

  slot.isBooked = false;

  await slot.save();

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
  });
});

// BOOKING ANALYTICS
const getBookingAnalytics = asyncHandler(async (req, res) => {
  // Total bookings
  const totalBookings = await Booking.countDocuments();

  // Active bookings
  const activeBookings = await Booking.countDocuments({
    status: "Booked",
  });

  // Cancelled bookings
  const cancelledBookings = await Booking.countDocuments({
    status: "Cancelled",
  });

  // Bookings grouped by turf
  const bookingsPerTurf = await Booking.aggregate([
    {
      $group: {
        _id: "$turf",
        totalBookings: {
          $sum: 1,
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      totalBookings,
      activeBookings,
      cancelledBookings,
      bookingsPerTurf,
    },
  });
});

// GET BOOKINGS FOR OWNER TURFS
const getOwnerBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate({
      path: "turf",
      match: { owner: req.user._id },
      select: "name location sportType pricePerHour owner",
    })
    .populate("slot", "date startTime endTime")
    .populate("user", "name email");

  const ownerBookings = bookings.filter(
    (booking) => booking.turf !== null
  );

  res.status(200).json({
    success: true,
    count: ownerBookings.length,
    data: ownerBookings,
  });
});

// OWNER BOOKING ANALYTICS
const getOwnerAnalytics = asyncHandler(async (req, res) => {
  const ownerBookings = await Booking.find()
    .populate({
      path: "turf",
      match: { owner: req.user._id },
      select: "name location sportType pricePerHour owner",
    });

  const filteredBookings = ownerBookings.filter(
    (booking) => booking.turf !== null
  );

  const totalBookings = filteredBookings.length;

  const activeBookings = filteredBookings.filter(
    (booking) => booking.status === "Booked"
  ).length;

  const cancelledBookings = filteredBookings.filter(
    (booking) => booking.status === "Cancelled"
  ).length;

  res.status(200).json({
    success: true,
    analytics: {
      totalBookings,
      activeBookings,
      cancelledBookings,
    },
  });
});

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookingAnalytics,
  getOwnerBookings,
  getOwnerAnalytics,
};