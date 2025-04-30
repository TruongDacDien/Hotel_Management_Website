const express = require('express');
const router = express.Router();

const ServiceType = require('../models/ServiceType');
const ServiceTypeService = require('../services/serviceTypeService');
const ServiceTypeController = require('../controllers/serviceTypeController');
const pool = require('../config/database');

const model = new ServiceType(pool);
const service = new ServiceTypeService(model);
const controller = new ServiceTypeController(service);

// Routes
router.get('/', controller.getAll);
router.get('/:serviceTypeId', controller.getById);
router.post('/', controller.create);
router.put('/:serviceTypeId', controller.update);
router.delete('/:serviceTypeId', controller.delete);

module.exports = router;