class ServiceUsageDetail {
    constructor(pool) {
      this.pool = pool;
    }
  
    async getAll() {
      const [rows] = await this.pool.query('SELECT * FROM CT_SDDichVu');
      return rows;
    }
  
    async getById(bookingId, serviceId) {
      const [rows] = await this.pool.query(
        'SELECT * FROM CT_SDDichVu WHERE MaPhieu = ? AND MaDV = ?',
        [bookingId, serviceId]
      );
      return rows[0];
    }
  
    async create(data) {
      const { bookingId, serviceId, quantity } = data;
      await this.pool.query(
        `INSERT INTO CT_SDDichVu (MaPhieu, MaDV, SoLuong)
         VALUES (?, ?, ?)`,
        [bookingId, serviceId, quantity]
      );
      return data;
    }
  
    async update(bookingId, serviceId, data) {
      const { quantity } = data;
      await this.pool.query(
        `UPDATE CT_SDDichVu
         SET SoLuong = ?
         WHERE MaPhieu = ? AND MaDV = ?`,
        [quantity, bookingId, serviceId]
      );
      return { bookingId, serviceId, ...data };
    }
  
    async delete(bookingId, serviceId) {
      await this.pool.query(
        'DELETE FROM CT_SDDichVu WHERE MaPhieu = ? AND MaDV = ?',
        [bookingId, serviceId]
      );
      return true;
    }
  }
  
  module.exports = ServiceUsageDetail;
  