class InvoiceController {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
        
        // Bind all methods
        this.getAllInvoices = this.getAllInvoices.bind(this);
        this.getInvoiceById = this.getInvoiceById.bind(this);
        this.getInvoicesByEmployeeId = this.getInvoicesByEmployeeId.bind(this);
        this.getInvoicesByRentalDetailId = this.getInvoicesByRentalDetailId.bind(this);
        this.createInvoice = this.createInvoice.bind(this);
        this.updateInvoice = this.updateInvoice.bind(this);
        this.deleteInvoice = this.deleteInvoice.bind(this);
    }

    async getAllInvoices(req, res, next) {
        try {
            const invoices = await this.invoiceService.getAllInvoices();
            res.json(invoices);
        } catch (err) {
            next(err);
        }
    }

    async getInvoiceById(req, res, next) {
        try {
            const invoice = await this.invoiceService.getInvoiceById(req.params.id);
            res.json(invoice);
        } catch (err) {
            next(err);
        }
    }

    async getInvoicesByEmployeeId(req, res, next) {
        try {
            const invoices = await this.invoiceService.getInvoicesByEmployeeId(req.params.employeeId);
            res.json(invoices);
        } catch (err) {
            next(err);
        }
    }

    async getInvoicesByRentalDetailId(req, res, next) {
        try {
            const invoices = await this.invoiceService.getInvoicesByRentalDetailId(req.params.rentalDetailId);
            res.json(invoices);
        } catch (err) {
            next(err);
        }
    }

    async createInvoice(req, res, next) {
        try {
            const newInvoice = await this.invoiceService.createInvoice(req.body);
            res.status(201).json(newInvoice);
        } catch (err) {
            next(err);
        }
    }

    async updateInvoice(req, res, next) {
        try {
            const updatedInvoice = await this.invoiceService.updateInvoice(
                req.params.id,
                req.body
            );
            res.json(updatedInvoice);
        } catch (err) {
            next(err);
        }
    }

    async deleteInvoice(req, res, next) {
        try {
            await this.invoiceService.deleteInvoice(req.params.id);
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = InvoiceController;