import databaseInstance from "../config/database.js";

class RoomType {
    static pool = databaseInstance.getPool();

    // Lấy tất cả loại phòng
    static async getAll() {
        try {
            const [rows] = await this.pool.query('SELECT * FROM LoaiPhong');
            return rows;
        } catch (error) {
            console.error("Error fetching all room types:", error);
            throw new Error("Error fetching all room types");
        }
    }

    // Lấy loại phòng theo ID
    static async getById(roomTypeId) {
        try {
            const [rows] = await this.pool.query(
                'SELECT * FROM LoaiPhong WHERE MaLoaiPhong = ?',
                [roomTypeId]
            );
            if (rows.length === 0) {
                throw new Error("Room type not found");
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching room type (ID: ${roomTypeId}):`, error);
            throw new Error("Error fetching room type");
        }
    }

    // Tạo loại phòng mới
    static async create(data) {
        try {
            const { name, description, policy, cancellationPolicy, maxGuests, dailyRate, hourlyRate, imageUrl } = data;
            const [result] = await this.pool.query(
                `INSERT INTO LoaiPhong (TenLoaiPhong, MoTa, ChinhSach, ChinhSachHuy, SoNguoiToiDa, GiaNgay, GiaGio, ImageURL, IsDeleted)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, description, policy, cancellationPolicy, maxGuests, dailyRate, hourlyRate, imageUrl, 0]
            );
            return { MaLoaiPhong: result.insertId, ...data };
        } catch (error) {
            console.error("Error creating room type:", error);
            throw new Error("Error creating room type");
        }
    }

    // Cập nhật loại phòng
    static async update(roomTypeId, data) {
        try {
            const { name, description, policy, cancellationPolicy, maxGuests, dailyRate, hourlyRate, imageUrl } = data;
            const [result] = await this.pool.query(
                `UPDATE LoaiPhong
                 SET TenLoaiPhong = ?, MoTa = ?, ChinhSach = ?, ChinhSachHuy = ?, SoNguoiToiDa = ?, GiaNgay = ?, GiaGio = ?, ImageURL = ?
                 WHERE MaLoaiPhong = ?`,
                [name, description, policy, cancellationPolicy, maxGuests, dailyRate, hourlyRate, imageUrl, roomTypeId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Room type not found or not updated");
            }
            return { roomTypeId, ...data };
        } catch (error) {
            console.error(`Error updating room type (ID: ${roomTypeId}):`, error);
            throw new Error("Error updating room type");
        }
    }

    // Xóa loại phòng
    static async delete(roomTypeId) {
        try {
            const [result] = await this.pool.query(
                'DELETE FROM LoaiPhong WHERE MaLoaiPhong = ?',
                [roomTypeId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Room type not found or not deleted");
            }
            return true;
        } catch (error) {
            console.error(`Error deleting room type (ID: ${roomTypeId}):`, error);
            throw new Error("Error deleting room type");
        }
    }
}

export default RoomType;
