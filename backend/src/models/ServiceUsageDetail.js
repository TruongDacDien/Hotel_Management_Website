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

  // Lấy chi tiết sử dụng dịch vụ
  static async getById(serviceUsageDetailId) {
    try {
      const [rows] = await this.pool.query(
        "SELECT * FROM CT_SDDichVu WHERE MaCTSDDV = ?",
        [serviceUsageDetailId]
      );
      if (rows.length === 0) {
        throw new Error("Service usage detail not found");
      }
      return rows[0];
    } catch (error) {
      console.error(`Error fetching service usage detail ID: ${serviceUsageDetailId}:`, error);
      throw new Error("Error fetching service usage detail");
    }
  }

  // Tạo chi tiết sử dụng dịch vụ mới
  static async create(data) {
    try {
      const { customerId, serviceId, quantity, offeredDate, totalMoney } = data;
      const [result] = await this.pool.query(
        "INSERT INTO CT_SDDichVu (MaCTPT, MaKH, MaDV, SL, ThanhTien, NgayApDung, TrangThai, DaThanhToan, HinhThucThanhToan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [null, customerId, serviceId, quantity, totalMoney, offeredDate, null, null, null]
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

  static async updatePaymentStatus(serviceUsageDetailId, status, isPaid, paymentMethod) {
    try {
      const [result] = await this.pool.query(
        `UPDATE CT_SDDichVu
                 SET TrangThai = ?, DaThanhToan = ?, HinhThucThanhToan = ?
                 WHERE MaCTSDDV = ?`,
        [status, isPaid, paymentMethod, serviceUsageDetailId]
      );
      if (result.affectedRows === 0) {
        throw new Error("Service usage detail not found or not updated");
      }
      return result;
    } catch (error) {
      console.error(`Error updating service usage detail with ID ${serviceUsageDetailId}:`, error);
      throw new Error("Error updating service usage detail");
    }
  }

  static async cancelServiceUsageDetail(serviceUsageDetailId) {
    try {
      const detail = await this.getById(serviceUsageDetailId);
      if (detail.TrangThai === "Đã sử dụng") {
        throw new Error("Dịch vũ đã sử dụng, không thể hủy!");
      }
      if (detail.TrangThai && detail.TrangThai.startsWith("Đã hủy")) {
        throw new Error("Dịch vụ đã bị hủy trước đó.");
      }
      if (detail.DaThanhToan === 1 && detail.HinhThucThanhToan === "Online") {
        const [result] = await this.pool.query(
          "UPDATE CT_SDDichVu SET TrangThai = 'Đã hủy - Chờ hoàn tiền' WHERE MaCTSDDV = ?",
          [serviceUsageDetailId]
        );
        if (result.affectedRows === 0) {
          throw new Error("Service usage detail not found");
        }
        return true;
      }
      if (detail.DaThanhToan === 0 && detail.HinhThucThanhToan === "Direct") {
        const [result] = await this.pool.query(
          "UPDATE CT_SDDichVu SET TrangThai = 'Đã hủy' WHERE MaCTSDDV = ?",
          [serviceUsageDetailId]
        );
        if (result.affectedRows === 0) {
          throw new Error("Service usage detail not found");
        }
        return true;
      }
      throw new Error("Không thể hủy dịch vụ với trạng thái hiện tại.");
    } catch (error) {
      console.error(`Error canceling service usage detail with ID ${serviceUsageDetailId}:`, error);
      throw new Error("Error canceling service usage detail");
    }
  }
}

export default ServiceUsageDetail;
