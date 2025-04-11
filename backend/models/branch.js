// models/Branch.js
class Branch {
    constructor(pool) {
      this.pool = pool;
    }
  
    // Lấy tất cả chi nhánh
    async getAll() {
      const [rows] = await this.pool.query('SELECT * FROM ChiNhanh WHERE IsDeleted = 0');
      return rows;
    }
  
    // Lấy chi nhánh theo ID
    async getById(id) {
      const [rows] = await this.pool.query('SELECT * FROM ChiNhanh WHERE MaCN = ? AND IsDeleted = 0', [id]);
      return rows[0];
    }
  
    // Tạo chi nhánh mới
    async create(branchData) {
      const { TenCN, DiaChi, KinhDo, ViDo } = branchData;
      const [result] = await this.pool.query(
        'INSERT INTO ChiNhanh (TenCN, DiaChi, KinhDo, ViDo, IsDeleted) VALUES (?, ?, ?, ?, 0)',
        [TenCN, DiaChi, KinhDo, ViDo]
      );
      return { MaCN: result.insertId, ...branchData };
    }
  
    // Cập nhật chi nhánh
    async update(id, branchData) {
      const { TenCN, DiaChi, KinhDo, ViDo } = branchData;
      await this.pool.query(
        'UPDATE ChiNhanh SET TenCN = ?, DiaChi = ?, KinhDo = ?, ViDo = ? WHERE MaCN = ?',
        [TenCN, DiaChi, KinhDo, ViDo, id]
      );
      return { MaCN: id, ...branchData };
    }
  
    // Xóa mềm chi nhánh
    async softDelete(id) {
      await this.pool.query('UPDATE ChiNhanh SET IsDeleted = 1 WHERE MaCN = ?', [id]);
      return true;
    }
  }
  
  module.exports = Branch;