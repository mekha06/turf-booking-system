const Slot = require("../models/Slot");
const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");

// CREATE SLOT
const createSlot = asyncHandler(async (req, res) => {
  const {
    turf,
    date,
    startTime,
    endTime,
  } = req.body;

  // Check duplicate slot
  const existingSlot = await Slot.findOne({
    turf,
    date,
    startTime,
    endTime,
  });

  if (existingSlot) {
    throw new AppError("Slot already exists", 400);
  }

  const slot = await Slot.create({
    turf,
    date,
    startTime,
    endTime,
  });

  res.status(201).json({
    success: true,
    message: "Slot created successfully",
    data: slot,
  });
});

// GET SLOTS BY TURF
const getSlotsByTurf = asyncHandler(async (req, res) => {
  const { turfId } = req.params;

  const slots = await Slot.find({
    turf: turfId,
  }).populate("turf", "name sportType location pricePerHour");
  res.status(200).json({
    success: true,
    count: slots.length,
    data: slots,
  });
});

// GENERATE MULTIPLE SLOTS
const generateSlots = asyncHandler(async (req, res) => {
  const {
    turfId,
    date,
    startHour,
    endHour,
    slotDuration,
  } = req.body;

  // Validation
  if (
    !turfId ||
    !date ||
    startHour === undefined ||
    endHour === undefined ||
    !slotDuration
  ) {
    throw new AppError("All fields are required", 400);
  }

  const slots = [];

  // Generate slots
  for (
    let hour = startHour;
    hour < endHour;
    hour += slotDuration
  ) {
    const startTime = `${String(hour).padStart(2, "0")}:00`;

    const endTime = `${String(hour + slotDuration).padStart(2, "0")}:00`;

    slots.push({
      turf: turfId,
      date,
      startTime,
      endTime,
    });
  }

  // Insert generated slots
  const createdSlots = await Slot.insertMany(slots, {
    ordered: false,
  });

  res.status(201).json({
    success: true,
    message: "Slots generated successfully",
    count: createdSlots.length,
    data: createdSlots,
  });
});

// SEARCH AVAILABLE SLOTS
const searchAvailableSlots = asyncHandler(async (req, res) => {
  const {
    date,
    startTime,
  } = req.query;

  // Validation
  if (!date || !startTime) {
    throw new AppError(
      "Date and startTime are required",
      400
    );
  }

  // Find available slots
  const slots = await Slot.find({
    date,
    startTime,
    isBooked: false,
  }).populate("turf", "name location sportType");

  res.status(200).json({
    success: true,
    count: slots.length,
    data: slots,
  });
});

// UPDATE SLOT
const updateSlot = asyncHandler(async (req, res) => {
  const slot = await Slot.findById(req.params.id);

  if (!slot) {
    throw new AppError("Slot not found", 404);
  }

  if (slot.isBooked) {
    throw new AppError("Cannot update a booked slot", 400);
  }

  const updatedSlot = await Slot.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Slot updated successfully",
    data: updatedSlot,
  });
});

// DELETE SLOT
const deleteSlot = asyncHandler(async (req, res) => {
  const slot = await Slot.findById(req.params.id);

  if (!slot) {
    throw new AppError("Slot not found", 404);
  }

  if (slot.isBooked) {
    throw new AppError("Cannot delete a booked slot", 400);
  }

  await slot.deleteOne();

  res.status(200).json({
    success: true,
    message: "Slot deleted successfully",
  });
});

module.exports = {
  createSlot,
  getSlotsByTurf,
  generateSlots,
  searchAvailableSlots,
  updateSlot,
  deleteSlot,
};