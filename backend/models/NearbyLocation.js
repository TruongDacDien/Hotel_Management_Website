class NearbyLocation {
    constructor(pool) {
        this.pool = pool;
    }

    // Get all nearby locations
    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM DiaDiemXungQuanh');
        return rows;
    }

    // Get nearby location by ID
    async getById(id) {
        const [rows] = await this.pool.query('SELECT * FROM DiaDiemXungQuanh WHERE MaDD = ?', [id]);
        return rows[0];
    }

    // Get locations by branch ID
    async getByBranchId(branchId) {
        const [rows] = await this.pool.query('SELECT * FROM DiaDiemXungQuanh WHERE MaCN = ?', [branchId]);
        return rows;
    }

    // Create new nearby location
    async create(locationData) {
        const { MaCN, TenDD, LoaiDD, DiaChi, MoTa, DanhGia, KinhDo, ViDo, KhoangCach } = locationData;
        const [result] = await this.pool.query(
            'INSERT INTO DiaDiemXungQuanh (MaCN, TenDD, LoaiDD, DiaChi, MoTa, DanhGia, KinhDo, ViDo, KhoangCach, ThoiGianCapNhat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [MaCN, TenDD, LoaiDD, DiaChi, MoTa, DanhGia, KinhDo, ViDo, KhoangCach]
        );
        return { MaDD: result.insertId, ...locationData };
    }

    // Update nearby location
    async update(id, locationData) {
        const { MaCN, TenDD, LoaiDD, DiaChi, MoTa, DanhGia, KinhDo, ViDo, KhoangCach } = locationData;
        await this.pool.query(
            'UPDATE DiaDiemXungQuanh SET MaCN = ?, TenDD = ?, LoaiDD = ?, DiaChi = ?, MoTa = ?, DanhGia = ?, KinhDo = ?, ViDo = ?, KhoangCach = ?, ThoiGianCapNhat = NOW() WHERE MaDD = ?',
            [MaCN, TenDD, LoaiDD, DiaChi, MoTa, DanhGia, KinhDo, ViDo, KhoangCach, id]
        );
        return { MaDD: id, ...locationData };
    }

    // Delete nearby location
    async delete(id) {
        await this.pool.query('DELETE FROM DiaDiemXungQuanh WHERE MaDD = ?', [id]);
        return true;
    }
}

module.exports = NearbyLocation;