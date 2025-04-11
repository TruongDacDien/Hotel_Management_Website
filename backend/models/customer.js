// models/Customer.js
class Customer {
    constructor(pool) {
      this.pool = pool;
    }
  
    // Lấy tất cả khách hàng (không bao gồm đã xóa)
    async getAll() {
      const [rows] = await this.pool.query('SELECT * FROM KhachHang WHERE IsDeleted = 0');
      return rows;
    }
  
    // Lấy khách hàng theo ID
    async getById(id) {
      const [rows] = await this.pool.query('SELECT * FROM KhachHang WHERE MaKH = ? AND IsDeleted = 0', [id]);
      return rows[0];
    }
  
    // Lấy khách hàng theo CCCD
    async getByCCCD(cccd) {
      const [rows] = await this.pool.query('SELECT * FROM KhachHang WHERE CCCD = ? AND IsDeleted = 0', [cccd]);
      return rows[0];
    }
  
    // Lấy khách hàng theo số điện thoại
    async getByPhone(sdt) {
      const [rows] = await this.pool.query('SELECT * FROM KhachHang WHERE SDT = ? AND IsDeleted = 0', [sdt]);
      return rows[0];
    }
  
    // Tạo khách hàng mới
    async create(customerData) {
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
    }
  
    // Cập nhật thông tin khách hàng
    async update(id, customerData) {
      const {
        TenKH,
        GioiTinh,
        CCCD,
        CCCDImage,
        SDT,
        DiaChi,
        QuocTich
      } = customerData;
  
      await this.pool.query(
        `UPDATE KhachHang SET 
        TenKH = ?, 
        GioiTinh = ?, 
        CCCD = ?, 
        CCCDImage = ?, 
        SDT = ?, 
        DiaChi = ?, 
        QuocTich = ? 
        WHERE MaKH = ?`,
        [TenKH, GioiTinh, CCCD, CCCDImage, SDT, DiaChi, QuocTich, id]
      );
  
      return { MaKH: id, ...customerData };
    }
  
    // Xóa mềm khách hàng
    async softDelete(id) {
      await this.pool.query('UPDATE KhachHang SET IsDeleted = 1 WHERE MaKH = ?', [id]);
      return true;
    }
  }
  
  module.exports = Customer;