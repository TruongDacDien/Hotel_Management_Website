import databaseInstance from "../config/database.js";
import Service from "./Service.js";

class ServiceUsageDetail {
  static pool = databaseInstance.getPool();

  // Lấy tất cả chi tiết sử dụng dịch vụ
  static async getAll() {
    try {
      const [rows] = await this.pool.query("SELECT * FROM CT_SDDichVu");
      return rows;
    } catch (error) {
      console.error("Error fetching all service usage details:", error);
      throw new Error("Error fetching all service usage details");
    }
  }

  // Lấy chi tiết sử dụng dịch vụ theo ID đặt phòng và ID dịch vụ
  static async getById(bookingId, serviceId) {
    try {
      const [rows] = await this.pool.query(
        "SELECT * FROM CT_SDDichVu WHERE MaPhieu = ? AND MaDV = ?",
        [bookingId, serviceId]
      );
      if (rows.length === 0) {
        throw new Error("Service usage detail not found");
      }
      return rows[0];
    } catch (error) {
      console.error(`Error fetching service usage detail (Booking ID: ${bookingId}, Service ID: ${serviceId}):`, error);
      throw new Error("Error fetching service usage detail");
    }
  }

  // Tạo chi tiết sử dụng dịch vụ mới
  static async create(data) {
    try {
      const { customerId, serviceId, quantity, offeredDate, totalMoney } = data;
      const [result] = await this.pool.query(
        "INSERT INTO CT_SDDichVu (MaCTPT, MaKH, MaDV, SL, ThanhTien, NgayApDung) VALUES (?, ?, ?, ?, ?, ?)",
        [null, customerId, serviceId, quantity, totalMoney, offeredDate]
      );
      const [serviceUsageDetailRow] = await this.pool.query("SELECT * FROM CT_SDDichVu WHERE MaCTSDDV = ?", [result.insertId]);
      return serviceUsageDetailRow[0];
    } catch (error) {
      console.error("Error creating service usage detail:", error);
      throw new Error("Error creating service usage detail");
    }
  }

  // Cập nhật chi tiết sử dụng dịch vụ
  static async update(bookingId, serviceId, data) {
    try {
      const { quantity } = data;
      const [result] = await this.pool.query(
        "UPDATE CT_SDDichVu SET SoLuong = ? WHERE MaPhieu = ? AND MaDV = ?",
        [quantity, bookingId, serviceId]
      );
      if (result.affectedRows === 0) {
        throw new Error("Service usage detail not found or not updated");
      }
      return { bookingId, serviceId, ...data };
    } catch (error) {
      console.error(`Error updating service usage detail (Booking ID: ${bookingId}, Service ID: ${serviceId}):`, error);
      throw new Error("Error updating service usage detail");
    }
  }

  // Xóa chi tiết sử dụng dịch vụ
  static async delete(bookingId, serviceId) {
    try {
      const [result] = await this.pool.query(
        "DELETE FROM CT_SDDichVu WHERE MaPhieu = ? AND MaDV = ?",
        [bookingId, serviceId]
      );
      if (result.affectedRows === 0) {
        throw new Error("Service usage detail not found or not deleted");
      }
      return true;
    } catch (error) {
      console.error(`Error deleting service usage detail (Booking ID: ${bookingId}, Service ID: ${serviceId}):`, error);
      throw new Error("Error deleting service usage detail");
    }
  }
}

export default ServiceUsageDetail;
