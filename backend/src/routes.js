import express from "express";
import amenityDetailRoutes from './routes/amenityDetailRoutes.js';
import amenityRoutes from './routes/amenityRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import bookingDetailRoutes from './routes/bookingDetailRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import chatHistoryRoutes from './routes/chatHistoryRoutes.js';
import chatSessionRoutes from './routes/chatSessionRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import customerAccountRoutes from './routes/customerAccountRoutes.js';
import employeeAccountRoutes from './routes/employeeAccountRoutes.js';
import employeeActivityRoutes from './routes/employeeActivityRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import nearbyLocationRoutes from './routes/nearbyLocationRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import roomTypeRoutes from './routes/roomTypeRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import serviceTypeRoutes from './routes/serviceTypeRoutes.js';
import serviceUsageDetailRoutes from './routes/serviceUsageDetailRoutes.js';
import authRoutes from './auth/authRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const router = express.Router();

// Routes
router.use('/api/amenityDetails', amenityDetailRoutes);
router.use('/api/amenities', amenityRoutes);
router.use('/api/bookings', bookingRoutes);
router.use('/api/bookingDetails', bookingDetailRoutes);
router.use('/api/branches', branchRoutes);
router.use('/api/chatHistories', chatHistoryRoutes);
router.use('/api/chatSessions', chatSessionRoutes);
router.use('/api/customers', customerRoutes);
router.use('/api/customerAccounts', customerAccountRoutes);
router.use('/api/employees', employeeRoutes);
router.use('/api/employeeAccounts', employeeAccountRoutes);
router.use('/api/employeeActivities', employeeActivityRoutes);
router.use('/api/invoices', invoiceRoutes);
router.use('/api/nearbyLocations', nearbyLocationRoutes);
router.use('/api/roles', roleRoutes);
router.use('/api/rooms', roomRoutes);
router.use('/api/roomTypes', roomTypeRoutes);
router.use('/api/services', serviceRoutes);
router.use('/api/serviceTypes', serviceTypeRoutes);
router.use('/api/serviceUsageDetails', serviceUsageDetailRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/email', emailRoutes);
router.use('/api/payment', paymentRoutes);

router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Not found route"
  });
});

export default router;