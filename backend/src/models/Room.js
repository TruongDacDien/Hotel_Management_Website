import databaseInstance from "../config/database.js";

class Room {
    static pool = databaseInstance.getPool();

    // Lấy tất cả phòng
    static async getAll() {
        try {
            const [rows] = await this.pool.query('SELECT * FROM Phong');
            return rows;
        } catch (error) {
            console.error("Error fetching all rooms:", error);
            throw new Error("Error fetching all rooms");
        }
    }

    // Lấy phòng theo ID
    static async getById(roomId) {
        try {
            const [rows] = await this.pool.query(
                'SELECT * FROM Phong WHERE SoPhong = ?',
                [roomId]
            );
            if (rows.length === 0) {
                throw new Error("Room not found");
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching room (ID: ${roomId}):`, error);
            throw new Error("Error fetching room");
        }
    }

    // Tạo phòng mới
    static async create(data) {
        try {
            const { roomNumber, roomTypeId, cleanliness, imageUrl, isSelected } = data;
            const [result] = await this.pool.query(
                `INSERT INTO Phong (SoPhong, MaLoaiPhong, DonDep, ImageURL, IsSelected, IsDeleted)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [roomNumber, roomTypeId, cleanliness, imageUrl, isSelected, 0]
            );
            return { SoPhong: result.insertId, ...data };
        } catch (error) {
            console.error("Error creating room:", error);
            throw new Error("Error creating room");
        }
    }

    // Cập nhật phòng
    static async update(roomId, data) {
        try {
            const { roomTypeId, cleanliness, imageUrl, isSelected } = data;
            const [result] = await this.pool.query(
                `UPDATE Phong
                 SET MaLoaiPhong = ?, DonDep = ?, ImageURL = ?, IsSelected = ?
                 WHERE SoPhong = ?`,
                [roomTypeId, cleanliness, imageUrl, isSelected, roomId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Room not found or not updated");
            }
            return { roomId, ...data };
        } catch (error) {
            console.error(`Error updating room (ID: ${roomId}):`, error);
            throw new Error("Error updating room");
        }
    }

    // Xóa phòng
    static async delete(roomId) {
        try {
            const [result] = await this.pool.query(
                'DELETE FROM Phong WHERE SoPhong = ?',
                [roomId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Room not found or not deleted");
            }
            return true;
        } catch (error) {
            console.error(`Error deleting room (ID: ${roomId}):`, error);
            throw new Error("Error deleting room");
        }
    }
}

export default Room;
