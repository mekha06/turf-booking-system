const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");

const Booking = require("../models/Booking");
const Slot = require("../models/Slot");
const AppError = require("../utils/AppError");

// CREATE PAYMENT ORDER
const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    throw new AppError("Amount is required", 400);
  }

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  res.status(201).json({
    success: true,
    message: "Payment order created successfully",
    data: order,
  });
});

// VERIFY PAYMENT + CREATE BOOKING
const verifyPayment = asyncHandler(async (req, res) => {
  const {
    turf,
    slot,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (
    !turf ||
    !slot ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    throw new AppError("All payment and booking fields are required", 400);
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new AppError("Invalid payment signature", 400);
  }

  const existingSlot = await Slot.findById(slot);

  if (!existingSlot) {
    throw new AppError("Slot not found", 404);
  }

  if (existingSlot.isBooked) {
    throw new AppError("Slot already booked", 400);
  }

  const booking = await Booking.create({
    user: req.user._id,
    turf,
    slot,
    paymentStatus: "Paid",
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
  });

  existingSlot.isBooked = true;
  await existingSlot.save();

  res.status(200).json({
    success: true,
    message: "Payment verified and booking created successfully",
    data: {
      booking,
      payment: {
        razorpay_order_id,
        razorpay_payment_id,
      },
    },
  });
});

module.exports = {
  createPaymentOrder,
  verifyPayment,
};