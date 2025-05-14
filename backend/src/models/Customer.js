import databaseInstance from "../config/database.js";

class Customer {
  static pool = databaseInstance.getPool();

  // Lấy tất cả khách hàng (không bao gồm đã xóa)
  static async getAll() {
    try {
      const [rows] = await this.pool.query('SELECT * FROM KhachHang WHERE IsDeleted = 0');
      return rows;
    } catch (error) {
      console.error("Error fetching all customers:", error);
      throw new Error("Error fetching all customers");
    }
  }

  // Lấy khách hàng theo ID
  static async getById(id) {
    try {
      const [rows] = await this.pool.query(
        'SELECT * FROM KhachHang WHERE MaKH = ? AND IsDeleted = 0',
        [id]
      );
      if (rows.length === 0) {
        throw new Error("Customer not found");
      }
      return rows[0];
    } catch (error) {
      console.error(`Error fetching customer (ID: ${id}):`, error);
      throw new Error("Error fetching customer");
    }
  }

  // Lấy khách hàng theo CCCD
  static async getByCCCD(cccd) {
    try {
      const [rows] = await this.pool.query(
        'SELECT * FROM KhachHang WHERE CCCD = ? AND IsDeleted = 0',
        [cccd]
      );
      if (rows.length === 0) {
        throw new Error("Customer not found");
      }
      return rows[0];
    } catch (error) {
      console.error(`Error fetching customer (CCCD: ${cccd}):`, error);
      throw new Error("Error fetching customer by CCCD");
    }
  }

  // Lấy khách hàng theo số điện thoại
  static async getByPhone(sdt) {
    try {
      const [rows] = await this.pool.query(
        'SELECT * FROM KhachHang WHERE SDT = ? AND IsDeleted = 0',
        [sdt]
      );
      if (rows.length === 0) {
        throw new Error("Customer not found");
      }
      return rows[0];
    } catch (error) {
      console.error(`Error fetching customer (Phone: ${sdt}):`, error);
      throw new Error("Error fetching customer by phone");
    }
  }

  // Tạo khách hàng mới
  static async create(customerData) {
    try {
      const {
        TenKH,
        GioiTinh,
        CCCD,
        CCCDImage,
        SDT,
        DiaChi,
        QuocTich
      } = customerData;

      const [result] = await this.pool.query(
        `INSERT INTO KhachHang 
                    (TenKH, GioiTinh, CCCD, CCCDImage, SDT, DiaChi, QuocTich, IsDeleted) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
        [TenKH, GioiTinh, CCCD, CCCDImage, SDT, DiaChi, QuocTich]
      );

      return { MaKH: result.insertId, ...customerData };
    } catch (error) {
      console.error("Error creating customer:", error);
      throw new Error("Error creating customer");
    }
  }

  // Cập nhật thông tin khách hàng
  static async update(id, customerData) {
    try {
      const {
        TenKH,
        GioiTinh,
        CCCD,
        CCCDImage,
        SDT,
        DiaChi,
        QuocTich
      } = customerData;

      const [result] = await this.pool.query(
        `UPDATE KhachHang SET 
                    TenKH = ?, 
                    GioiTinh = ?, 
                    CCCD = ?, 
                    CCCDImage = ?, 
                    SDT = ?, 
                    DiaChi = ?, 
                    QuocTich = ? 
                    WHERE MaKH = ? AND IsDeleted = 0`,
        [TenKH, GioiTinh, CCCD, CCCDImage, SDT, DiaChi, QuocTich, id]
      );
      if (result.affectedRows === 0) {
        throw new Error("Customer not found or not updated");
      }
      return { MaKH: id, ...customerData };
    } catch (error) {
      console.error(`Error updating customer (ID: ${id}):`, error);
      throw new Error("Error updating customer");
    }
  }

  // Xóa mềm khách hàng
  static async softDelete(id) {
    try {
      const [result] = await this.pool.query(
        'UPDATE KhachHang SET IsDeleted = 1 WHERE MaKH = ?',
        [id]
      );
      if (result.affectedRows === 0) {
        throw new Error("Customer not found or not deleted");
      }
      return true;
    } catch (error) {
      console.error(`Error soft deleting customer (ID: ${id}):`, error);
      throw new Error("Error soft deleting customer");
    }
  }
}

export default Customer;
