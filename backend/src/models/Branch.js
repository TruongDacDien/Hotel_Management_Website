import databaseInstance from "../config/database.js";

class Branch {
  static pool = databaseInstance.getPool();

  // Lấy tất cả chi nhánh
  static async getAll() {
    try {
      const [rows] = await this.pool.query("SELECT * FROM ChiNhanh WHERE IsDeleted = 0");
      return rows;
    } catch (error) {
      console.error("Error fetching all branches:", error);
      throw new Error("Error fetching all branches");
    }
  }

  // Lấy chi nhánh theo ID
  static async getById(id) {
    try {
      const [rows] = await this.pool.query(
        "SELECT * FROM ChiNhanh WHERE MaCN = ? AND IsDeleted = 0",
        [id]
      );
      if (rows.length === 0) {
        throw new Error("Branch not found");
      }
      return rows[0];
    } catch (error) {
      console.error(`Error fetching branch (ID: ${id}):`, error);
      throw new Error("Error fetching branch");
    }
  }

  // Tạo chi nhánh mới
  static async create(branchData) {
    try {
      const { TenCN, DiaChi, KinhDo, ViDo } = branchData;
      const [result] = await this.pool.query(
        "INSERT INTO ChiNhanh (TenCN, DiaChi, KinhDo, ViDo, IsDeleted) VALUES (?, ?, ?, ?, 0)",
        [TenCN, DiaChi, KinhDo, ViDo]
      );
      return { MaCN: result.insertId, ...branchData };
    } catch (error) {
      console.error("Error creating branch:", error);
      throw new Error("Error creating branch");
    }
  }

  // Cập nhật chi nhánh
  static async update(id, branchData) {
    try {
      const { TenCN, DiaChi, KinhDo, ViDo } = branchData;
      const [result] = await this.pool.query(
        "UPDATE ChiNhanh SET TenCN = ?, DiaChi = ?, KinhDo = ?, ViDo = ? WHERE MaCN = ? AND IsDeleted = 0",
        [TenCN, DiaChi, KinhDo, ViDo, id]
      );
      if (result.affectedRows === 0) {
        throw new Error("Branch not found or not updated");
      }
      return { MaCN: id, ...branchData };
    } catch (error) {
      console.error(`Error updating branch (ID: ${id}):`, error);
      throw new Error("Error updating branch");
    }
  }

  // Xóa mềm chi nhánh
  static async softDelete(id) {
    try {
      const [result] = await this.pool.query(
        "UPDATE ChiNhanh SET IsDeleted = 1 WHERE MaCN = ?",
        [id]
      );
      if (result.affectedRows === 0) {
        throw new Error("Branch not found or not deleted");
      }
      return true;
    } catch (error) {
      console.error(`Error soft deleting branch (ID: ${id}):`, error);
      throw new Error("Error soft deleting branch");
    }
  }
}

export default Branch;
