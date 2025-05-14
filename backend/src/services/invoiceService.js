import Invoice from "../models/Invoice.js";

class InvoiceService {
    static async getAllInvoices() {
        return await Invoice.getAll();
    }

    static async getInvoiceById(id) {
        const invoice = await Invoice.getById(id);
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        return invoice;
    }

    static async getInvoicesByEmployeeId(employeeId) {
        const invoices = await Invoice.getByEmployeeId(employeeId);
        if (!invoices || invoices.length === 0) {
            throw new Error('No invoices found for this employee');
        }
        return invoices;
    }

    static async getInvoicesByRentalDetailId(rentalDetailId) {
        const invoices = await Invoice.getByRentalDetailId(rentalDetailId);
        if (!invoices || invoices.length === 0) {
            throw new Error('No invoices found for this rental detail');
        }
        return invoices;
    }

    static async createInvoice(invoiceData) {
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

        return await Invoice.create(invoiceData);
    }

    static async updateInvoice(id, invoiceData) {
        await this.getInvoiceById(id); // Check if exists

        // Validate total amount if provided
        if (invoiceData.TongTien !== undefined && invoiceData.TongTien < 0) {
            throw new Error('Total amount cannot be negative');
        }

        return await Invoice.update(id, invoiceData);
    }

    static async deleteInvoice(id) {
        await this.getInvoiceById(id); // Check if exists
        return await Invoice.delete(id);
    }
}

export default InvoiceService;