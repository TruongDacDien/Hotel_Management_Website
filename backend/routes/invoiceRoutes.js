const express = require('express');
const router = express.Router();
const InvoiceController = require('../controllers/invoiceController');
const InvoiceService = require('../services/invoiceService');
const Invoice = require('../models/Invoice');
const pool = require('../config/database');

// Initialize dependencies
const invoiceModel = new Invoice(pool);
const invoiceService = new InvoiceService(invoiceModel);
const invoiceController = new InvoiceController(invoiceService);

// Define routes
router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.get('/employee/:employeeId', invoiceController.getInvoicesByEmployeeId);
router.get('/rental-detail/:rentalDetailId', invoiceController.getInvoicesByRentalDetailId);
router.post('/', invoiceController.createInvoice);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;