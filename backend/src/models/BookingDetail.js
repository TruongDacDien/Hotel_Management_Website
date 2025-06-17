import databaseInstance from "../config/database.js";

class BookingDetail {
  static pool = databaseInstance.getPool();

  // Get all booking details
  static async getAll() {
    try {
      const [rows] = await this.pool.query(
        "SELECT * FROM CT_PhieuThue WHERE IsDeleted = 0"
      );
      return rows;
    } catch (error) {
      console.error("Error fetching all booking details:", error);
      throw new Error("Error fetching all booking details");
    }
  }

  // Get booking detail by booking ID and room ID
  static async getById(bookingDetailId) {
    try {
      const [rows] = await this.pool.query(
        "SELECT * FROM CT_PhieuThue WHERE MaCTPT = ?",
        [bookingDetailId]
      );
      if (rows.length === 0) {
        throw new Error("Booking detail not found");
      }
      return rows[0];
    } catch (error) {
      console.error(`Error fetching booking detail with ID ${bookingDetailId}:`, error);
      throw new Error("Error fetching booking detail");
    }
  }

  // Create a new booking detail
  static async create(data) {
    try {
      const { bookingId, roomId, checkInDate, checkOutDate, price } = data;
      const [result] = await this.pool.query(
        `INSERT INTO CT_PhieuThue (MaPhieu, MaPhong, NgayNhanPhong, NgayTraPhong, DonGia, IsDeleted)
                 VALUES (?, ?, ?, ?, ?, 0)`,
        [bookingId, roomId, checkInDate, checkOutDate, price]
      );
      return { MaCTPT: result.insertId, ...data };
    } catch (error) {
      console.error("Error creating booking detail:", error);
      throw new Error("Error creating booking detail");
    }
  }

  // Update a booking detail
  static async updateCheckIn(bookingDetailId, text) {
    try {
      const [result] = await this.pool.query(
        `UPDATE CT_PhieuThue
                 SET NoiDungCheckIn = ? AND ThoiDiemCheckIn = NOW()
                 WHERE MaCTPT = ?`,
        [text, bookingDetailId]
      );
      if (result.affectedRows === 0) {
        throw new Error("Booking detail not found or not updated");
      }
      return result
    } catch (error) {
      console.error(`Error updating booking detail with ID ${bookingId} and room ID ${roomId}:`, error);
      throw new Error("Error updating booking detail");
    }
  }

  static async updateCheckOut(bookingDetailId, text) {
    try {
      const [result] = await this.pool.query(
        `UPDATE CT_PhieuThue
                 SET NoiDungCheckOut = ? AND ThoiDiemCheckOut = NOW()
                 WHERE MaCTPT = ?`,
        [text, bookingDetailId]
      );
      if (result.affectedRows === 0) {
        throw new Error("Booking detail not found or not updated");
      }
      return result
    } catch (error) {
      console.error(`Error updating booking detail with ID ${bookingId} and room ID ${roomId}:`, error);
      throw new Error("Error updating booking detail");
    }
  }

  static async updatePaymentStatus(bookingDetailId, status, isPaid, paymentMethod) {
    try {
      const [result] = await this.pool.query(
        `UPDATE CT_PhieuThue
                 SET TinhTrangThue = ?, DaThanhToan = ?, HinhThucThanhToan = ?
                 WHERE MaCTPT = ?`,
        [status, isPaid, paymentMethod, bookingDetailId]
      );
      if (result.affectedRows === 0) {
        throw new Error("Booking detail not found or not updated");
      }
      return result;
    } catch (error) {
      console.error(`Error updating booking detail with ID ${bookingDetailId}:`, error);
      throw new Error("Error updating booking detail");
    }
  }

  // Soft delete a booking detail
  static async softDelete(bookingDetailId) {
    try {
      const [result] = await this.pool.query(
        "UPDATE CT_PhieuThue SET IsDeleted = 1 WHERE MaCTPT = ?",
        [bookingDetailId]
      );
      if (result.affectedRows === 0) {
        throw new Error("Booking detail not found or not deleted");
      }
      return true;
    } catch (error) {
      console.error(`Error soft deleting booking detail with ID ${bookingDetailId}:`, error);
      throw new Error("Error soft deleting booking detail");
    }
  }

  static async cancelBookingDetail(bookingDetailId) {
    try {
      const detail = await this.getById(bookingDetailId);
      if (detail.TinhTrangThue !== "Phòng đã đặt") {
        throw new Error("Phiếu thuê đã sử dụng, không thể hủy!");
      }
      if (detail.TinhTrangThue && detail.TinhTrangThue.startsWith("Đã hủy")) {
        throw new Error("Phiếu thuê đã bị hủy trước đó.");
      }
      if (detail.DaThanhToan === 1 && detail.HinhThucThanhToan === "Online") {
        const [result] = await this.pool.query(
          "UPDATE CT_PhieuThue SET TinhTrangThue = 'Đã hủy - Chờ hoàn tiền' WHERE MaCTPT = ?",
          [bookingDetailId]
        );
        if (result.affectedRows === 0) {
          throw new Error("Booking detail not found");
        }
        return true;
      }
      if (detail.DaThanhToan === 0 && detail.HinhThucThanhToan === "Direct") {
        const [result] = await this.pool.query(
          "UPDATE CT_PhieuThue SET TinhTrangThue = 'Đã hủy' WHERE MaCTPT = ?",
          [bookingDetailId]
        );
        if (result.affectedRows === 0) {
          throw new Error("Booking detail not found");
        }
        return true;
      }
      throw new Error("Không thể hủy phiếu thuê với trạng thái hiện tại.");
    } catch (error) {
      console.error(`Error canceling booking detail with ID ${bookingDetailId}:`, error);
      throw new Error("Error canceling booking detail");
    }
  }
}

export default BookingDetail;
