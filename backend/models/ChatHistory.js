class ChatHistory {
    constructor(pool) {
        this.pool = pool;
    }

    // Get all chat history
    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM LichSuChat');
        return rows;
    }

    // Get chat history by ID
    async getById(id) {
        const [rows] = await this.pool.query('SELECT * FROM LichSuChat WHERE MaLS = ?', [id]);
        return rows[0];
    }

    // Get chat history by session ID
    async getBySessionId(sessionId) {
        const [rows] = await this.pool.query('SELECT * FROM LichSuChat WHERE MaPC = ? ORDER BY ThoiGianGui', [sessionId]);
        return rows;
    }

    // Get chat history by employee ID
    async getByEmployeeId(employeeId) {
        const [rows] = await this.pool.query('SELECT * FROM LichSuChat WHERE MaNV = ? ORDER BY ThoiGianGui', [employeeId]);
        return rows;
    }

    // Create new chat history
    async create(chatData) {
        const { MaPC, MaNV, NguoiGui, NoiDung, ThoiGianGui, MaLSTruocDo, ThoiGianHetHan } = chatData;
        const [result] = await this.pool.query(
            'INSERT INTO LichSuChat (MaPC, MaNV, NguoiGui, NoiDung, ThoiGianGui, MaLSTruocDo, ThoiGianHetHan) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [MaPC, MaNV, NguoiGui, NoiDung, ThoiGianGui || new Date(), MaLSTruocDo, ThoiGianHetHan]
        );
        return { MaLS: result.insertId, ...chatData };
    }

    // Update chat history
    async update(id, chatData) {
        const { MaPC, MaNV, NguoiGui, NoiDung, ThoiGianGui, MaLSTruocDo, ThoiGianHetHan } = chatData;
        await this.pool.query(
            'UPDATE LichSuChat SET MaPC = ?, MaNV = ?, NguoiGui = ?, NoiDung = ?, ThoiGianGui = ?, MaLSTruocDo = ?, ThoiGianHetHan = ? WHERE MaLS = ?',
            [MaPC, MaNV, NguoiGui, NoiDung, ThoiGianGui, MaLSTruocDo, ThoiGianHetHan, id]
        );
        return { MaLS: id, ...chatData };
    }

    // Delete chat history
    async delete(id) {
        await this.pool.query('DELETE FROM LichSuChat WHERE MaLS = ?', [id]);
        return true;
    }
}

module.exports = ChatHistory;