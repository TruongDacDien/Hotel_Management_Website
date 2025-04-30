const express = require('express');
const router = express.Router();

const CustomerAccount = require('../models/CustomerAccount');
const CustomerAccountService = require('../services/customerAccountService');
const CustomerAccountController = require('../controllers/customerAccountController');
const pool = require('../config/database');

const model = new CustomerAccount(pool);
const service = new CustomerAccountService(model);
const controller = new CustomerAccountController(service);

// Routes
router.get('/', controller.getAll);
router.get('/:accountId', controller.getById);
router.post('/', controller.create);
router.put('/:accountId', controller.update);
router.delete('/:accountId', controller.delete);

module.exports = router;