class Service {
  constructor(pool) {
    this.pool = pool;
  }

  // Get all services (non-deleted by default)
  async getAll(includeDeleted = false) {
    const query = includeDeleted
      ? "SELECT * FROM DichVu"
      : "SELECT * FROM DichVu WHERE IsDeleted = 0";
    const [rows] = await this.pool.query(query);
    return rows;
  }

  // Get service by ID
  async getById(id) {
    const [rows] = await this.pool.query(
      "SELECT * FROM DichVu WHERE MaDV = ? AND IsDeleted = 0",
      [id]
    );
    return rows[0];
  }

  // Get services by category
  async getByCategory(categoryId) {
    const [rows] = await this.pool.query(
      "SELECT * FROM DichVu WHERE MaLoaiDV = ? AND IsDeleted = 0",
      [categoryId]
    );
    return rows;
  }

  // Create new service
  async create(serviceData) {
    const { TenDV, MoTa, MaLoaiDV, Gia, ImageURL } = serviceData;
    const [result] = await this.pool.query(
      "INSERT INTO DichVu (TenDV, MoTa, MaLoaiDV, Gia, ImageURL, IsDeleted) VALUES (?, ?, ?, ?, 0)",
      [TenDV, MoTa, MaLoaiDV, Gia, ImageURL]
    );
    return { MaDV: result.insertId, ...serviceData };
  }

  // Update service
  async update(id, serviceData) {
    const { TenDV, MoTa, MaLoaiDV, Gia, ImageURL } = serviceData;
    await this.pool.query(
      "UPDATE DichVu SET TenDV = ?, MoTa = ?, MaLoaiDV = ?, Gia = ?, ImageURL = ? WHERE MaDV = ?",
      [TenDV, MoTa, MaLoaiDV, Gia, ImageURL, id]
    );
    return { MaDV: id, ...serviceData };
  }

  // Soft delete service
  async softDelete(id) {
    await this.pool.query("UPDATE DichVu SET IsDeleted = 1 WHERE MaDV = ?", [
      id,
    ]);
    return true;
  }

  // Restore soft-deleted service
  async restore(id) {
    await this.pool.query("UPDATE DichVu SET IsDeleted = 0 WHERE MaDV = ?", [
      id,
    ]);
    return true;
  }
}

module.exports = Service;
