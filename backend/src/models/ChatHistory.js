import databaseInstance from "../config/database.js";

class ChatHistory {
    static pool = databaseInstance.getPool();

    // Lấy tất cả lịch sử chat
    static async getAll() {
        try {
            const [rows] = await this.pool.query("SELECT * FROM LichSuChat WHERE IsDeleted = 0");
            return rows;
        } catch (error) {
            console.error("Error fetching all chat history:", error);
            throw new Error("Error fetching all chat history");
        }
    }

    // Lấy lịch sử chat theo ID
    static async getById(id) {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM LichSuChat WHERE MaLSC = ? AND IsDeleted = 0",
                [id]
            );
            if (rows.length === 0) {
                throw new Error("Chat history not found");
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching chat history (ID: ${id}):`, error);
            throw new Error("Error fetching chat history");
        }
    }

    // Lấy lịch sử chat theo session ID
    static async getBySessionId(sessionId) {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM LichSuChat WHERE MaPC = ? AND IsDeleted = 0 ORDER BY ThoiGianGui",
                [sessionId]
            );
            return rows;
        } catch (error) {
            console.error(`Error fetching chat history (Session ID: ${sessionId}):`, error);
            throw new Error("Error fetching chat history by session ID");
        }
    }

    // Tạo lịch sử chat mới
    static async create(chatData) {
        try {
            const { MaPC, NguoiGui, NoiDung, ThoiGianGui = new Date(), MaLSTruocDo } = chatData;
            const [result] = await this.pool.query(
                "INSERT INTO LichSuChat (MaPC, NguoiGui, NoiDung, ThoiGianGui, MaLSTruocDo, IsDeleted) VALUES (?, ?, ?, ?, ?, 0)",
                [MaPC, NguoiGui, NoiDung, ThoiGianGui, MaLSTruocDo]
            );
            return { MaLSC: result.insertId, ...chatData };
        } catch (error) {
            console.error("Error creating chat history:", error);
            throw new Error("Error creating chat history");
        }
    }

    // Cập nhật lịch sử chat
    static async update(id, chatData) {
        try {
            const { MaPC, NguoiGui, NoiDung, ThoiGianGui = new Date(), MaLSTruocDo } = chatData;
            const [result] = await this.pool.query(
                "UPDATE LichSuChat SET MaPC = ?, NguoiGui = ?, NoiDung = ?, ThoiGianGui = ?, MaLSTruocDo = ? WHERE MaLSC = ? AND IsDeleted = 0",
                [MaPC, NguoiGui, NoiDung, ThoiGianGui, MaLSTruocDo, id]
            );
            if (result.affectedRows === 0) {
                throw new Error("Chat history not found or not updated");
            }
            return { MaLSC: id, ...chatData };
        } catch (error) {
            console.error(`Error updating chat history (ID: ${id}):`, error);
            throw new Error("Error updating chat history");
        }
    }

    // Xóa mềm lịch sử chat
    static async softDelete(id) {
        try {
            const [result] = await this.pool.query(
                "UPDATE LichSuChat SET IsDeleted = 1 WHERE MaLSC = ?",
                [id]
            );
            if (result.affectedRows === 0) {
                throw new Error("Chat history not found or not deleted");
            }
            return true;
        } catch (error) {
            console.error(`Error soft deleting chat history (ID: ${id}):`, error);
            throw new Error("Error soft deleting chat history");
        }
    }
}

export default ChatHistory;
