const express = require('express');
const router = express.Router();

const Employee = require('../models/Employee');
const EmployeeService = require('../services/employeeService');
const EmployeeController = require('../controllers/employeeController');
const pool = require('../config/database');

const model = new Employee(pool);
const service = new EmployeeService(model);
const controller = new EmployeeController(service);

// Routes
router.get('/', controller.getAll);
router.get('/:employeeId', controller.getById);
router.post('/', controller.create);
router.put('/:employeeId', controller.update);
router.delete('/:employeeId', controller.delete);

module.exports = router;