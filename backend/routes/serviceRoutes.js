const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/serviceController');
const ServiceService = require('../services/serviceService');
const Service = require('../models/Service');
const pool = require('../config/database');

// Initialize dependencies
const serviceModel = new Service(pool);
const serviceService = new ServiceService(serviceModel);
const serviceController = new ServiceController(serviceService);

// Define routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.get('/category/:categoryId', serviceController.getServicesByCategory);
router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);
router.patch('/:id/restore', serviceController.restoreService);

module.exports = router;