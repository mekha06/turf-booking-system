const mongoose = require("mongoose");

const turfSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sportType: {
      type: String,
      required: true,
      enum: ["Football", "Cricket", "Badminton", "Tennis"],
    },

    location: {
      type: String,
      required: true,
    },

    pricePerHour: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    amenities: {
      type: [String],
      default: [],
    },

    image: {
      type: String,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Turf", turfSchema);