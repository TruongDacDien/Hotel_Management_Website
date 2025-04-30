const express = require('express');
const router = express.Router();

const Booking = require('../models/Booking');
const BookingService = require('../services/bookingService');
const BookingController = require('../controllers/bookingController');
const pool = require('../config/database');

const model = new Booking(pool);
const service = new BookingService(model);
const controller = new BookingController(service);

// Routes
router.get('/', controller.getAll);
router.get('/:bookingId', controller.getById);
router.post('/', controller.create);
router.put('/:bookingId', controller.update);
router.delete('/:bookingId', controller.delete);

module.exports = router;