class Role {
    constructor(pool) {
        this.pool = pool;
    }

    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM PhanQuyen');
        return rows;
    }

    async getById(roleId) {
        const [rows] = await this.pool.query(
            'SELECT * FROM PhanQuyen WHERE MaPQ = ?',
            [roleId]
        );
        return rows[0];
    }

    async create(data) {
        const { accountId, permissions } = data;
        await this.pool.query(
            `INSERT INTO PhanQuyen (MaTKNV, TrangChu, Phong, DatPhong, HoaDon, QLKhachHang, QLPhong, QLLoaiPhong, QLDichVu, QLLoaiDichVu, QLTienNghi, QLNhanVien, QLTaiKhoan, ThongKe)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [accountId, ...permissions]
        );
        return data;
    }

    async update(roleId, data) {
        const { accountId, permissions } = data;
        await this.pool.query(
            `UPDATE PhanQuyen
             SET MaTKNV = ?, TrangChu = ?, Phong = ?, DatPhong = ?, HoaDon = ?, QLKhachHang = ?, QLPhong = ?, QLLoaiPhong = ?, QLDichVu = ?, QLLoaiDichVu = ?, QLTienNghi = ?, QLNhanVien = ?, QLTaiKhoan = ?, ThongKe = ?
             WHERE MaPQ = ?`,
            [accountId, ...permissions, roleId]
        );
        return { roleId, ...data };
    }

    async delete(roleId) {
        await this.pool.query(
            'DELETE FROM PhanQuyen WHERE MaPQ = ?',
            [roleId]
        );
        return true;
    }
}

module.exports = Role;