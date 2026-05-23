const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    turf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turf",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate slots
slotSchema.index(
  {
    turf: 1,
    date: 1,
    startTime: 1,
    endTime: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Slot", slotSchema);