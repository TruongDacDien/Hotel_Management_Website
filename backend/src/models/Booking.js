import databaseInstance from "../config/database.js";
import RoomType from "./RoomType.js";

class Booking {
    static pool = databaseInstance.getPool();

    // Get all bookings
    static async getAll() {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM PhieuThue WHERE IsDeleted = 0"
            );
            return rows;
        } catch (error) {
            console.error("Error fetching all bookings:", error);
            throw new Error("Error fetching all bookings");
        }
    }

    // Get booking by ID
    static async getById(bookingId) {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM PhieuThue WHERE MaPhieuThue = ? AND IsDeleted = 0",
                [bookingId]
            );
            if (rows.length === 0) {
                throw new Error("Booking not found");
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching booking with ID ${bookingId}:`, error);
            throw new Error("Error fetching booking");
        }
    }

    // Create new booking
    static async create(data) {
        try {
            const { customerId, creationDate, employeeId } = data;
            const [result] = await this.pool.query(
                "INSERT INTO PhieuThue (MaKH, NgayLapPhieu, MaNV, IsDeleted) VALUES (?, ?, ?, 0)",
                [customerId, creationDate, employeeId]
            );
            return { MaPhieuThue: result.insertId, ...data };
        } catch (error) {
            console.error("Error creating booking:", error);
            throw new Error("Error creating booking");
        }
    }

    static async customerOrder(customerId, selectedRoom, numberOfCustomers, bookingData) {
        const connection = await this.pool.getConnection(); // Lấy kết nối từ pool
        try {
            await connection.beginTransaction(); // Bắt đầu giao dịch
            const [bookingResult] = await connection.query(
                "INSERT INTO PhieuThue (MaKH, NgayLapPhieu, MaNV, IsDeleted) VALUES (?, NOW(), 1, 0)",
                [customerId]
            );
            const bookingId = bookingResult.insertId;

            const { startDay, endDay, roomTypeId } = bookingData;
            let roomType = await RoomType.getById(roomTypeId);
            let start = new Date(startDay);
            let end = new Date(endDay);
            let diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            let totalMoney = roomType.GiaNgay * diffInDays;
            const [bookingDetailResult] = await connection.query(
                `INSERT INTO CT_PhieuThue (MaPhieuThue, SoPhong, NgayBD, NgayKT, ThoiDiemCheckIn, NoiDungCheckIn,ThoiDiemCheckOut,NoiDungCheckOut, SoNguoiO, TinhTrangThue, TienPhong)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [bookingId, selectedRoom, startDay, endDay, null, null, null, null, numberOfCustomers, "Phòng đã đặt", totalMoney]
            )

            await connection.commit(); // Commit giao dịch

            return { MaCTPT: bookingDetailResult.insertId, MaPhieuThue: bookingId, ...bookingData };
        } catch (error) {
            await connection.rollback(); // Rollback giao dịch nếu có lỗi
            console.error("Error creating booking:", error);
            throw new Error("Error creating booking");
        } finally {
            connection.release(); // Giải phóng kết nối
        }
    }

    // Update booking
    static async update(bookingId, data) {
        try {
            const { customerId, creationDate, employeeId } = data;
            const [result] = await this.pool.query(
                "UPDATE PhieuThue SET MaKH = ?, NgayLapPhieu = ?, MaNV = ? WHERE MaPhieuThue = ? AND IsDeleted = 0",
                [customerId, creationDate, employeeId, bookingId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Booking not found or not updated");
            }
            return { MaPhieuThue: bookingId, ...data };
        } catch (error) {
            console.error(`Error updating booking with ID ${bookingId}:`, error);
            throw new Error("Error updating booking");
        }
    }

    // Soft delete booking
    static async softDelete(bookingId) {
        try {
            const [result] = await this.pool.query(
                "UPDATE PhieuThue SET IsDeleted = 1 WHERE MaPhieuThue = ?",
                [bookingId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Booking not found or not deleted");
            }
            return true;
        } catch (error) {
            console.error(`Error soft deleting booking with ID ${bookingId}:`, error);
            throw new Error("Error soft deleting booking");
        }
    }
}

export default Booking;
