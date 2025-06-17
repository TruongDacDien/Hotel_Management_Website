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
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();

            // Bước 1: Thêm phiếu thuê
            const [bookingResult] = await connection.query(
                "INSERT INTO PhieuThue (MaKH, NgayLapPhieu, MaNV, IsDeleted) VALUES (?, NOW(), 1, 0)",
                [customerId]
            );
            const bookingId = bookingResult.insertId;

            // Bước 2: Tính toán tiền phòng
            const { startDay, endDay, roomTypeId } = bookingData;
            const roomType = await RoomType.getById(roomTypeId);
            const start = new Date(startDay);
            const end = new Date(endDay);
            const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            const totalMoney = roomType.GiaNgay * diffInDays;

            // Bước 3: Thêm chi tiết phiếu thuê
            const [bookingDetailResult] = await connection.query(
                `INSERT INTO CT_PhieuThue (MaPhieuThue, SoPhong, NgayBD, NgayKT, ThoiDiemCheckIn, NoiDungCheckIn, ThoiDiemCheckOut, NoiDungCheckOut, SoNguoiO, TinhTrangThue, TienPhong, DaThanhToan, HinhThucThanhToan)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [bookingId, selectedRoom, startDay, endDay, null, null, null, null, numberOfCustomers, "Phòng đã đặt", totalMoney, null, null]
            );
            const bookingDetailId = bookingDetailResult.insertId;

            // Bước 4: Truy vấn lại dữ liệu đầy đủ của phiếu thuê và chi tiết
            const [bookingRow] = await connection.query("SELECT * FROM PhieuThue WHERE MaPhieuThue = ?", [bookingId]);
            const [bookingDetailRow] = await connection.query("SELECT * FROM CT_PhieuThue WHERE MaCTPT = ?", [bookingDetailId]);

            await connection.commit();

            return {
                booking: bookingRow[0],
                bookingDetail: {
                    ...bookingDetailRow[0],
                    GiaNgay: roomType.GiaNgay
                }
            };
        } catch (error) {
            await connection.rollback();
            console.error("Error creating booking:", error);
            throw new Error("Error creating booking");
        } finally {
            connection.release();
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

    static async getAllCustomerOrder(customerId) {
        try {
            const [customerBookings] = await this.pool.query(
                `SELECT * 
                 FROM PhieuThue PT, CT_PhieuThue CTPT 
                 WHERE CTPT.MaPhieuThue = PT.MaPhieuThue AND PT.IsDeleted = 0 AND PT.MaKH = ?`,
                [customerId]
            );
            const [customerServices] = await this.pool.query(
                `SELECT * 
                 FROM CT_SDDichVu 
                 WHERE MaKH = ?`,
                [customerId]
            );
            return {
                customerId: customerId,
                bookings: customerBookings,
                services: customerServices
            };
        } catch (error) {
            console.error(`Error get booking with customer account ID ${customerId}:`, error);
            throw new Error("Error get booking with customer account ID");
        }
    }
}

export default Booking;
