const express = require('express');
const router = express.Router();

const ServiceUsageDetail = require('../models/serviceUsageDetail');
const ServiceUsageDetailService = require('../services/serviceUsageDetailService');
const ServiceUsageDetailController = require('../controllers/serviceUsageDetailController');
const pool = require('../config/database');

const model = new ServiceUsageDetail(pool);
const service = new ServiceUsageDetailService(model);
const controller = new ServiceUsageDetailController(service);

// Routes
router.get('/', controller.getAll);
router.get('/:bookingId/:serviceId', controller.getById);
router.post('/', controller.create);
router.put('/:bookingId/:serviceId', controller.update);
router.delete('/:bookingId/:serviceId', controller.delete);

module.exports = router;
