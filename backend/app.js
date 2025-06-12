// app.js
import cors from "cors";
import express from "express";
require("./instrument.js"); // Import Sentry instrumentation
const Sentry = require("@sentry/node");

// Sentry.init({
//   dsn: "https://YOUR_BACKEND_DSN_HERE",
//   environment: process.env.NODE_ENV || "development",
//   debug: true, // tuỳ chọn: xem log gửi lỗi trong terminal
// });

const app = express();
app.use(Sentry.Handlers.requestHandler());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const amenityDetailRoutes = require("./routes/amenityDetailRoutes");
const amenityRoutes = require("./routes/amenityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const bookingDetailRoutes = require("./routes/bookingDetailRoutes");
const branchRoutes = require("./routes/branchRoutes");
const chatHistoryRoutes = require("./routes/chatHistoryRoutes");
const chatSessionRoutes = require("./routes/chatSessionRoutes");
const customerRoutes = require("./routes/customerRoutes");
const customerAccountRoutes = require("./routes/customerAccountRoutes");
const employeeAccountRoutes = require("./routes/employeeAccountRoutes");
const employeeActivityRoutes = require("./routes/employeeActivityRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const nearbyLocationRoutes = require("./routes/nearbyLocationRoutes");
const roleRoutes = require("./routes/roleRoutes");
const roomRoutes = require("./routes/roomRoutes");
const roomTypeRoutes = require("./routes/roomTypeRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const serviceTypeRoutes = require("./routes/serviceTypeRoutes");
const serviceUsageDetailRoutes = require("./routes/serviceUsageDetailRoutes");

// Middleware
app.use(express.json());

// Routes

app.use("/api/amenityDetails", amenityDetailRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/bookingDetails", bookingDetailRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/chatHistories", chatHistoryRoutes);
app.use("/api/chatSessions", chatSessionRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/customerAccounts", customerAccountRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/employeeAccounts", employeeAccountRoutes);
app.use("/api/employeeActivities", employeeActivityRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/nearbyLocations", nearbyLocationRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/roomTypes", roomTypeRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/serviceTypes", serviceTypeRoutes);
app.use("/api/serviceUsageDetails", serviceUsageDetailRoutes);
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

Sentry.setupExpressErrorHandler(app);

app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Lỗi hệ thống",
    errorId: res.sentry, // res.sentry chứa ID của lỗi gửi đến Sentry
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
