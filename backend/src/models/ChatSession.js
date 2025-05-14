import databaseInstance from "../config/database.js";

class ChatSession {
    static pool = databaseInstance.getPool();

    // Lấy tất cả phiên chat
    static async getAll() {
        try {
            const [rows] = await this.pool.query("SELECT * FROM PhienChat WHERE IsDeleted = 0");
            return rows;
        } catch (error) {
            console.error("Error fetching all chat sessions:", error);
            throw new Error("Error fetching all chat sessions");
        }
    }

    // Lấy phiên chat theo ID
    static async getById(sessionId) {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM PhienChat WHERE MaPC = ? AND IsDeleted = 0",
                [sessionId]
            );
            if (rows.length === 0) {
                throw new Error("Chat session not found");
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching chat session (ID: ${sessionId}):`, error);
            throw new Error("Error fetching chat session");
        }
    }

    // Tạo phiên chat mới
    static async create(data) {
        try {
            const { customerId, temporarySender, startTime, endTime, status, expirationTime } = data;
            const [result] = await this.pool.query(
                `INSERT INTO PhienChat (MaKH, NguoiGuiTamThoi, ThoiGianBD, ThoiGianKT, TrangThai, ThoiGianHetHan, IsDeleted)
                 VALUES (?, ?, ?, ?, ?, ?, 0)`,
                [customerId, temporarySender, startTime, endTime, status, expirationTime]
            );
            return { MaPC: result.insertId, ...data };
        } catch (error) {
            console.error("Error creating chat session:", error);
            throw new Error("Error creating chat session");
        }
    }

    // Cập nhật phiên chat
    static async update(sessionId, data) {
        try {
            const { customerId, temporarySender, startTime, endTime, status, expirationTime } = data;
            const [result] = await this.pool.query(
                `UPDATE PhienChat
                 SET MaKH = ?, NguoiGuiTamThoi = ?, ThoiGianBD = ?, ThoiGianKT = ?, TrangThai = ?, ThoiGianHetHan = ?
                 WHERE MaPC = ? AND IsDeleted = 0`,
                [customerId, temporarySender, startTime, endTime, status, expirationTime, sessionId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Chat session not found or not updated");
            }
            return { MaPC: sessionId, ...data };
        } catch (error) {
            console.error(`Error updating chat session (ID: ${sessionId}):`, error);
            throw new Error("Error updating chat session");
        }
    }

    // Xóa mềm phiên chat
    static async softDelete(sessionId) {
        try {
            const [result] = await this.pool.query(
                "UPDATE PhienChat SET IsDeleted = 1 WHERE MaPC = ?",
                [sessionId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Chat session not found or not deleted");
            }
            return true;
        } catch (error) {
            console.error(`Error soft deleting chat session (ID: ${sessionId}):`, error);
            throw new Error("Error soft deleting chat session");
        }
    }
}

export default ChatSession;
