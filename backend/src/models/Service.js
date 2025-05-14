import databaseInstance from "../config/database.js";

class Service {
  static pool = databaseInstance.getPool();

  // Lấy tất cả dịch vụ (mặc định không lấy các dịch vụ đã xóa)
  static async getAll(includeDeleted = false) {
    try {
      const query = includeDeleted
        ? "SELECT * FROM DichVu"
        : "SELECT * FROM DichVu WHERE IsDeleted = 0";
      const [rows] = await this.pool.query(query);
      return rows;
    } catch (error) {
      console.error("Error fetching all services:", error);
      throw new Error("Error fetching all services");
    }
  }

  // Lấy dịch vụ theo ID
  static async getById(id) {
    try {
      const [rows] = await this.pool.query(
        "SELECT * FROM DichVu WHERE MaDV = ? AND IsDeleted = 0",
        [id]
      );
      if (rows.length === 0) {
        throw new Error("Service not found");
      }
      return rows[0];
    } catch (error) {
      console.error(`Error fetching service (ID: ${id}):`, error);
      throw new Error("Error fetching service");
    }
  }

  // Lấy dịch vụ theo danh mục
  static async getByCategory(categoryId) {
    try {
      const [rows] = await this.pool.query(
        "SELECT * FROM DichVu WHERE MaLoaiDV = ? AND IsDeleted = 0",
        [categoryId]
      );
      return rows;
    } catch (error) {
      console.error(`Error fetching services for category (ID: ${categoryId}):`, error);
      throw new Error("Error fetching services by category");
    }
  }

  // Tạo dịch vụ mới
  static async create(serviceData) {
    try {
      const { TenDV, MoTa, MaLoaiDV, Gia, ImageURL } = serviceData;
      const [result] = await this.pool.query(
        "INSERT INTO DichVu (TenDV, MoTa, MaLoaiDV, Gia, ImageURL, IsDeleted) VALUES (?, ?, ?, ?, ?, 0)",
        [TenDV, MoTa, MaLoaiDV, Gia, ImageURL]
      );
      return { MaDV: result.insertId, ...serviceData };
    } catch (error) {
      console.error("Error creating service:", error);
      throw new Error("Error creating service");
    }
  }

  // Cập nhật dịch vụ
  static async update(id, serviceData) {
    try {
      const { TenDV, MoTa, MaLoaiDV, Gia, ImageURL } = serviceData;
      const [result] = await this.pool.query(
        "UPDATE DichVu SET TenDV = ?, MoTa = ?, MaLoaiDV = ?, Gia = ?, ImageURL = ? WHERE MaDV = ?",
        [TenDV, MoTa, MaLoaiDV, Gia, ImageURL, id]
      );
      if (result.affectedRows === 0) {
        throw new Error("Service not found or not updated");
      }
      return { MaDV: id, ...serviceData };
    } catch (error) {
      console.error(`Error updating service (ID: ${id}):`, error);
      throw new Error("Error updating service");
    }
  }

  // Soft delete dịch vụ
  static async softDelete(id) {
    try {
      const [result] = await this.pool.query(
        "UPDATE DichVu SET IsDeleted = 1 WHERE MaDV = ?",
        [id]
      );
      if (result.affectedRows === 0) {
        throw new Error("Service not found or not deleted");
      }
      return true;
    } catch (error) {
      console.error(`Error soft-deleting service (ID: ${id}):`, error);
      throw new Error("Error soft-deleting service");
    }
  }

  // Khôi phục dịch vụ đã xóa mềm
  static async restore(id) {
    try {
      const [result] = await this.pool.query(
        "UPDATE DichVu SET IsDeleted = 0 WHERE MaDV = ?",
        [id]
      );
      if (result.affectedRows === 0) {
        throw new Error("Service not found or not restored");
      }
      return true;
    } catch (error) {
      console.error(`Error restoring service (ID: ${id}):`, error);
      throw new Error("Error restoring service");
    }
  }
}

export default Service;
