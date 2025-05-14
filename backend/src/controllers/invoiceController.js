import expressAsyncHandler from "express-async-handler";
import InvoiceService from "../services/invoiceService.js";

class InvoiceController {
    getAllInvoices = expressAsyncHandler(async (req, res) => {
        const invoices = await InvoiceService.getAllInvoices();
        res.json(invoices);
    });

    getInvoiceById = expressAsyncHandler(async (req, res) => {
        const invoice = await InvoiceService.getInvoiceById(req.params.id);
        res.json(invoice);
    });

    getInvoicesByEmployeeId = expressAsyncHandler(async (req, res) => {
        const invoices = await InvoiceService.getInvoicesByEmployeeId(req.params.employeeId);
        res.json(invoices);
    });

    getInvoicesByRentalDetailId = expressAsyncHandler(async (req, res) => {
        const invoices = await InvoiceService.getInvoicesByRentalDetailId(req.params.rentalDetailId);
        res.json(invoices);
    });

    createInvoice = expressAsyncHandler(async (req, res) => {
        const newInvoice = await InvoiceService.createInvoice(req.body);
        res.status(201).json(newInvoice);
    });

    updateInvoice = expressAsyncHandler(async (req, res) => {
        const updatedInvoice = await InvoiceService.updateInvoice(req.params.id, req.body);
        res.json(updatedInvoice);
    });

    deleteInvoice = expressAsyncHandler(async (req, res) => {
        await InvoiceService.deleteInvoice(req.params.id);
        res.status(204).end();
    });
}

export default new InvoiceController();