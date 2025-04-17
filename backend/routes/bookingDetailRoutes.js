const express = require('express');
const router = express.Router();

const BookingDetail = require('../models/BookingDetail');
const BookingDetailService = require('../services/bookingDetailService');
const BookingDetailController = require('../controllers/bookingDetailController');
const pool = require('../config/database');

const model = new BookingDetail(pool);
const service = new BookingDetailService(model);
const controller = new BookingDetailController(service);

// Routes
router.get('/', controller.getAll);
router.get('/:bookingId/:roomId', controller.getById);
router.post('/', controller.create);
router.put('/:bookingId/:roomId', controller.update);
router.delete('/:bookingId/:roomId', controller.delete);

module.exports = router;
