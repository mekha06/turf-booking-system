const Turf = require("../models/Turf");
const asyncHandler = require("express-async-handler");

// CREATE TURF
const createTurf = asyncHandler(async (req, res) => {
  const {
    name,
    sportType,
    location,
    pricePerHour,
    description,
    amenities,
    image,
  } = req.body;

  const existingTurf = await Turf.findOne({
  name,
  location,
  owner: req.user._id,
});

if (existingTurf) {
  return res.status(400).json({
    success: false,
    message: "Turf already exists for this owner at this location",
  });
}

  const turf = await Turf.create({
    name,
    sportType,
    location,
    pricePerHour,
    description,
    amenities,
    image,
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Turf created successfully",
    data: turf,
  });
});

// GET ALL TURFS WITH PAGINATION + FILTERING + SORTING + SEARCH
const getTurfs = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 5;

  const skip = (page - 1) * limit;

  const filters = {};

  // Keyword Search
  if (req.query.keyword) {
    filters.name = {
      $regex: req.query.keyword,
      $options: "i",
    };
  }

  // Sport Type Filter
  if (req.query.sportType) {
    filters.sportType = req.query.sportType;
  }

  // Location Filter
  if (req.query.location) {
    filters.location = req.query.location;
  }

  // Sorting
  const sort = req.query.sort || "-createdAt";

  // Fetch Turfs
  const turfs = await Turf.find(filters)
    .populate("owner", "name email")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // Total Count
  const total = await Turf.countDocuments(filters);

  res.status(200).json({
    success: true,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalTurfs: total,
    count: turfs.length,
    sort,
    data: turfs,
  });
});

// GET MY TURFS
const getMyTurfs = asyncHandler(async (req, res) => {
  const turfs = await Turf.find({
    owner: req.user._id,
  }).populate("owner", "name email");

  res.status(200).json({
    success: true,
    count: turfs.length,
    data: turfs,
  });
});

// UPDATE TURF
const updateTurf = asyncHandler(async (req, res) => {
  const turf = await Turf.findById(req.params.id);

  // Turf not found
  if (!turf) {
    return res.status(404).json({
      success: false,
      message: "Turf not found",
    });
  }

  // Ownership check
  if (turf.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this turf",
    });
  }

  const updatedTurf = await Turf.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Turf updated successfully",
    data: updatedTurf,
  });
});

// DELETE TURF
const deleteTurf = asyncHandler(async (req, res) => {
  const turf = await Turf.findById(req.params.id);

  // Turf not found
  if (!turf) {
    return res.status(404).json({
      success: false,
      message: "Turf not found",
    });
  }

  // Ownership check
  if (turf.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this turf",
    });
  }

  await turf.deleteOne();

  res.status(200).json({
    success: true,
    message: "Turf deleted successfully",
  });
});

module.exports = {
  createTurf,
  getTurfs,
  getMyTurfs,
  updateTurf,
  deleteTurf,
};