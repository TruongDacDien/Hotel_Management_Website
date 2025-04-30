class Booking {
    constructor(pool) {
        this.pool = pool;
    }

    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM PhieuThue');
        return rows;
    }

    async getById(bookingId) {
        const [rows] = await this.pool.query(
            'SELECT * FROM PhieuThue WHERE MaPhieuThue = ?',
            [bookingId]
        );
        return rows[0];
    }

    async create(data) {
        const { customerId, creationDate, employeeId } = data;
        await this.pool.query(
            `INSERT INTO PhieuThue (MaKH, NgayLapPhieu, MaNV, IsDeleted)
             VALUES (?, ?, ?, ?)`,
            [customerId, creationDate, employeeId, 0]
        );
        return data;
    }

    async update(bookingId, data) {
        const { customerId, creationDate, employeeId } = data;
        await this.pool.query(
            `UPDATE PhieuThue
             SET MaKH = ?, NgayLapPhieu = ?, MaNV = ?
             WHERE MaPhieuThue = ?`,
            [customerId, creationDate, employeeId, bookingId]
        );
        return { bookingId, ...data };
    }

    async delete(bookingId) {
        await this.pool.query(
            'DELETE FROM PhieuThue WHERE MaPhieuThue = ?',
            [bookingId]
        );
        return true;
    }
}

module.exports = Booking;