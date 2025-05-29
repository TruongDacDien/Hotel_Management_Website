import databaseInstance from "../config/database.js";

class RatingRoomType {
  static pool = databaseInstance.getPool();

  static async getAll() {
    try {
      const [rows] = await this.pool.query("SELECT * FROM DanhGiaLP");
      return rows;
    } catch (error) {
      console.error("Error fetching all ratings:", error);
      throw new Error("Error fetching all ratings");
    }
  }

  static async getById(id) {
    try {
      const [rows] = await this.pool.query(
        "SELECT * FROM DanhGiaLP WHERE MaLoaiPhong = ?",
        [id]
      );
      if (rows.length === 0) {
        throw new Error("Role not found");
      }
      return rows;
    } catch (error) {
      console.error(`Error fetching rating (ID: ${id}):`, error);
      throw new Error("Error fetching rating");
    }
  }

  static async create(data) {
    try {
      const { MaLoaiPhong, MaTKKH, SoSao, NoiDung } = data;
      const [result] = await this.pool.query(
        "INSERT INTO DanhGiaLP (MaLoaiPhong, MaTKKH, SoSao, NoiDung, ThoiGian) VALUES (?, ?, ?, ?, NOW())",
        [MaLoaiPhong, MaTKKH, SoSao, NoiDung]
      );
    } catch (error) {
      console.error("Error creating rating:", error);
      throw new Error("Error creating rating");
    }
  }

  static async update(ratingId, data) {
    try {
      const { MaLoaiPhong, MaKH, SoSao, NoiDung } = data;
      const [result] = await this.pool.query(
        `UPDATE DanhGiaLP
                 SET MaLoaiPhong = ?, MaKH = ?, SoSao = ?, NoiDung = ?, ThoiGian = NOW()
                 WHERE MaDGLP = ?`,
        [MaLoaiPhong, MaKH, SoSao, NoiDung, ratingId]
      );
      if (result.affectedRows === 0) {
        throw new Error("Rating not found or not updated");
      }
    } catch (error) {
      console.error(`Error updating rating (ID: ${ratingId}):`, error);
      throw new Error("Error updating role");
    }
  }

  static async delete(id) {
    try {
      const [result] = await this.pool.query(
        "DELETE FROM DanhGiaLP WHERE MaDGLP = ?",
        [id]
      );
      if (result.affectedRows === 0) {
        throw new Error("Rating not found or not deleted");
      }
      return true;
    } catch (error) {
      console.error(`Error deleting rating (ID: ${id}):`, error);
      throw new Error("Error deleting rating");
    }
  }
}

export default RatingRoomType;
