const express = require('express');
const router = express.Router();

const EmployeeAccount = require('../models/EmployeeAccount');
const EmployeeAccountService = require('../services/employeeAccountService');
const EmployeeAccountController = require('../controllers/employeeAccountController');
const pool = require('../config/database');

const model = new EmployeeAccount(pool);
const service = new EmployeeAccountService(model);
const controller = new EmployeeAccountController(service);

// Routes
router.get('/', controller.getAll);
router.get('/:accountId', controller.getById);
router.post('/', controller.create);
router.put('/:accountId', controller.update);
router.delete('/:accountId', controller.delete);

module.exports = router;