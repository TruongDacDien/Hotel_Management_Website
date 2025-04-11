// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customerController');
const CustomerService = require('../services/customerService');
const Customer = require('../models/customer');
const pool = require('../config/database');
const uploadImage = require('../middlewares/uploadMiddleware');

// Khởi tạo dependency
const customerModel = new Customer(pool);
const customerService = new CustomerService(customerModel);
const customerController = new CustomerController(customerService);

// Định tuyến
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.get('/cccd/:cccd', customerController.getCustomerByCCCD);
router.get('/phone/:phone', customerController.getCustomerByPhone);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);
router.post('/:id/upload-cccd',uploadImage.single('cccdImage'),customerController.uploadCCCDImage);
router.delete('/:id/delete-cccd-image',customerController.deleteCCCDImage);

module.exports = router;