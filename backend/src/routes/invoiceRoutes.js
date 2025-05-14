import express from "express";
import invoiceController from "../controllers/invoiceController.js"

const router = express.Router();

router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.get('/employee/:employeeId', invoiceController.getInvoicesByEmployeeId);
router.get('/rental-detail/:rentalDetailId', invoiceController.getInvoicesByRentalDetailId);
router.post('/', invoiceController.createInvoice);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

export default router;