const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const turfRoutes = require("./routes/turfRoutes");
const slotRoutes = require("./routes/slotRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const errorHandler = require("./middlewares/errorMiddleware");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/turfs", turfRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EasyGo API Running",
  });
});
app.use(errorHandler);

module.exports = app;