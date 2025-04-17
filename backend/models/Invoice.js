class Invoice {
    constructor(pool) {
        this.pool = pool;
    }

    // Get all invoices
    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM HoaDon');
        return rows;
    }

    // Get invoice by ID
    async getById(id) {
        const [rows] = await this.pool.query('SELECT * FROM HoaDon WHERE MaHD = ?', [id]);
        return rows[0];
    }

    // Get invoices by employee ID
    async getByEmployeeId(employeeId) {
        const [rows] = await this.pool.query('SELECT * FROM HoaDon WHERE MaNV = ?', [employeeId]);
        return rows;
    }

    // Get invoices by rental detail ID
    async getByRentalDetailId(rentalDetailId) {
        const [rows] = await this.pool.query('SELECT * FROM HoaDon WHERE MaCTPT = ?', [rentalDetailId]);
        return rows;
    }

    // Create new invoice
    async create(invoiceData) {
        const { MaNV, MaCTPT, NgayLap, TongTien } = invoiceData;
        const [result] = await this.pool.query(
            'INSERT INTO HoaDon (MaNV, MaCTPT, NgayLap, TongTien) VALUES (?, ?, ?, ?)',
            [MaNV, MaCTPT, NgayLap, TongTien]
        );
        return { MaHD: result.insertId, ...invoiceData };
    }

    // Update invoice
    async update(id, invoiceData) {
        const { MaNV, MaCTPT, NgayLap, TongTien } = invoiceData;
        await this.pool.query(
            'UPDATE HoaDon SET MaNV = ?, MaCTPT = ?, NgayLap = ?, TongTien = ? WHERE MaHD = ?',
            [MaNV, MaCTPT, NgayLap, TongTien, id]
        );
        return { MaHD: id, ...invoiceData };
    }

    // Delete invoice
    async delete(id) {
        await this.pool.query('DELETE FROM HoaDon WHERE MaHD = ?', [id]);
        return true;
    }
}

module.exports = Invoice;