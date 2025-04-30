const express = require('express');
const router = express.Router();

const EmployeeActivity = require('../models/EmployeeActivity');
const EmployeeActivityService = require('../services/employeeActivityService');
const EmployeeActivityController = require('../controllers/employeeActivityController');
const pool = require('../config/database');

const model = new EmployeeActivity(pool);
const service = new EmployeeActivityService(model);
const controller = new EmployeeActivityController(service);

// Routes
router.get('/', controller.getAll);
router.get('/:activityId', controller.getById);
router.post('/', controller.create);
router.put('/:activityId', controller.update);
router.delete('/:activityId', controller.delete);

module.exports = router;