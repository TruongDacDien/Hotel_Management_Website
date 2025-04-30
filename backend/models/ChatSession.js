class ChatSession {
    constructor(pool) {
        this.pool = pool;
    }

    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM PhienChat');
        return rows;
    }

    async getById(sessionId) {
        const [rows] = await this.pool.query(
            'SELECT * FROM PhienChat WHERE MaPC = ?',
            [sessionId]
        );
        return rows[0];
    }

    async create(data) {
        const { customerId, temporarySender, startTime, endTime, status, expirationTime } = data;
        await this.pool.query(
            `INSERT INTO PhienChat (MaKH, NguoiGuiTamThoi, ThoiGianBD, ThoiGianKT, TrangThai, ThoiGianHetHan)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [customerId, temporarySender, startTime, endTime, status, expirationTime]
        );
        return data;
    }

    async update(sessionId, data) {
        const { customerId, temporarySender, startTime, endTime, status, expirationTime } = data;
        await this.pool.query(
            `UPDATE PhienChat
             SET MaKH = ?, NguoiGuiTamThoi = ?, ThoiGianBD = ?, ThoiGianKT = ?, TrangThai = ?, ThoiGianHetHan = ?
             WHERE MaPC = ?`,
            [customerId, temporarySender, startTime, endTime, status, expirationTime, sessionId]
        );
        return { sessionId, ...data };
    }

    async delete(sessionId) {
        await this.pool.query(
            'DELETE FROM PhienChat WHERE MaPC = ?',
            [sessionId]
        );
        return true;
    }
}

module.exports = ChatSession;