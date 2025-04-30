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
        const [rows] = await this.pool.query('SELECT * FROM LichSuChat WHERE MaLSC = ?', [id]);
        return rows[0];
    }

    // Get chat history by session ID
    async getBySessionId(sessionId) {
        const [rows] = await this.pool.query('SELECT * FROM LichSuChat WHERE MaPC = ? ORDER BY ThoiGianGui', [sessionId]);
        return rows;
    }

    // Create new chat history
    async create(chatData) {
        const { MaPC, NguoiGui, NoiDung, ThoiGianGui, MaLSTruocDo } = chatData;
        const [result] = await this.pool.query(
            'INSERT INTO LichSuChat (MaPC, NguoiGui, NoiDung, ThoiGianGui, MaLSTruocDo) VALUES (?, ?, ?, ?, ?)',
            [MaPC, NguoiGui, NoiDung, ThoiGianGui || new Date(), MaLSTruocDo]
        );
        return { MaLSC: result.insertId, ...chatData };
    }

    // Update chat history
    async update(id, chatData) {
        const { MaPC, NguoiGui, NoiDung, ThoiGianGui, MaLSTruocDo } = chatData;
        await this.pool.query(
            'UPDATE LichSuChat SET MaPC = ?, NguoiGui = ?, NoiDung = ?, ThoiGianGui = ?, MaLSTruocDo = ? WHERE MaLSC = ?',
            [MaPC, NguoiGui, NoiDung, ThoiGianGui, MaLSTruocDo, id]
        );
        return { MaLSC: id, ...chatData };
    }

    // Delete chat history
    async delete(id) {
        await this.pool.query('DELETE FROM LichSuChat WHERE MaLSC = ?', [id]);
        return true;
    }
}

module.exports = ChatHistory;