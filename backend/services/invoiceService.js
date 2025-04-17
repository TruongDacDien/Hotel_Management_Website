class InvoiceService {
    constructor(invoiceModel) {
        this.invoiceModel = invoiceModel;
    }

    async getAllInvoices() {
        return this.invoiceModel.getAll();
    }

    async getInvoiceById(id) {
        const invoice = await this.invoiceModel.getById(id);
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        return invoice;
    }

    async getInvoicesByEmployeeId(employeeId) {
        const invoices = await this.invoiceModel.getByEmployeeId(employeeId);
        if (!invoices || invoices.length === 0) {
            throw new Error('No invoices found for this employee');
        }
        return invoices;
    }

    async getInvoicesByRentalDetailId(rentalDetailId) {
        const invoices = await this.invoiceModel.getByRentalDetailId(rentalDetailId);
        if (!invoices || invoices.length === 0) {
            throw new Error('No invoices found for this rental detail');
        }
        return invoices;
    }

    async createInvoice(invoiceData) {
        // Validate required fields
        if (!invoiceData.MaNV || !invoiceData.MaCTPT || invoiceData.TongTien === undefined) {
            throw new Error('Missing required fields: MaNV, MaCTPT, TongTien');
        }

        // Validate total amount is non-negative
        if (invoiceData.TongTien < 0) {
            throw new Error('Total amount cannot be negative');
        }

        // Set current date if not provided
        if (!invoiceData.NgayLap) {
            invoiceData.NgayLap = new Date();
        }

        return this.invoiceModel.create(invoiceData);
    }

    async updateInvoice(id, invoiceData) {
        await this.getInvoiceById(id); // Check if exists

        // Validate total amount if provided
        if (invoiceData.TongTien !== undefined && invoiceData.TongTien < 0) {
            throw new Error('Total amount cannot be negative');
        }

        return this.invoiceModel.update(id, invoiceData);
    }

    async deleteInvoice(id) {
        await this.getInvoiceById(id); // Check if exists
        return this.invoiceModel.delete(id);
    }
}

module.exports = InvoiceService;