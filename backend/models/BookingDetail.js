class BookingDetail {
    constructor(pool) {
      this.pool = pool;
    }
  
    async getAll() {
      const [rows] = await this.pool.query('SELECT * FROM CT_PhieuThue');
      return rows;
    }
  
    async getById(bookingId, roomId) {
      const [rows] = await this.pool.query(
        'SELECT * FROM CT_PhieuThue WHERE MaPhieu = ? AND MaPhong = ?',
        [bookingId, roomId]
      );
      return rows[0];
    }
  
    async create(data) {
      const { bookingId, roomId, checkInDate, checkOutDate, price } = data;
      await this.pool.query(
        `INSERT INTO CT_PhieuThue (MaPhieu, MaPhong, NgayNhanPhong, NgayTraPhong, DonGia)
         VALUES (?, ?, ?, ?, ?)`,
        [bookingId, roomId, checkInDate, checkOutDate, price]
      );
      return data;
    }
  
    async update(bookingId, roomId, data) {
      const { checkInDate, checkOutDate, price } = data;
      await this.pool.query(
        `UPDATE CT_PhieuThue
         SET NgayNhanPhong = ?, NgayTraPhong = ?, DonGia = ?
         WHERE MaPhieu = ? AND MaPhong = ?`,
        [checkInDate, checkOutDate, price, bookingId, roomId]
      );
      return { bookingId, roomId, ...data };
    }
  
    async delete(bookingId, roomId) {
      await this.pool.query(
        'DELETE FROM CT_PhieuThue WHERE MaPhieu = ? AND MaPhong = ?',
        [bookingId, roomId]
      );
      return true;
    }
  }
  
  module.exports = BookingDetail;
  