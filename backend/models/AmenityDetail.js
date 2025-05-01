class AmenityDetail {
    constructor(pool) {
        this.pool = pool;
    }

    // Get all amenity details
    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM CT_TienNghi WHERE IsDeleted = 0');
        return rows;
    }

    // Get amenity detail by ID
    async getById(id) {
        const [rows] = await this.pool.query('SELECT * FROM CT_TienNghi WHERE MaCTTN = ? AND IsDeleted = 0', [id]);
        return rows[0];
    }

    // Get amenities by room type
    async getByRoomType(roomTypeId) {
        const [rows] = await this.pool.query('SELECT * FROM CT_TienNghi WHERE MaLoaiPhong = ? AND IsDeleted = 0', [roomTypeId]);
        return rows;
    }

    // Create new amenity detail
    async create(detailData) {
        const { MaTN, MaLoaiPhong, SL, TenTN } = detailData;
        const [result] = await this.pool.query(
            'INSERT INTO CT_TienNghi (MaTN, MaLoaiPhong, SL, TenTN, IsDeleted) VALUES (?, ?, ?, ?, 0)',
            [MaTN, MaLoaiPhong, SL, TenTN]
        );
        return { MaCTTN: result.insertId, ...detailData };
    }

    // Update amenity detail
    async update(id, detailData) {
        const { MaTN, MaLoaiPhong, SL, TenTN } = detailData;
        await this.pool.query(
            'UPDATE CT_TienNghi SET MaTN = ?, MaLoaiPhong = ?, SL = ?, TenTN = ? WHERE MaCTTN = ?',
            [MaTN, MaLoaiPhong, SL, TenTN, id]
        );
        return { MaCTTN: id, ...detailData };
    }

    // Soft delete amenity detail
    async softDelete(id) {
        await this.pool.query('UPDATE CT_TienNghi SET IsDeleted = 1 WHERE MaCTTN = ?', [id]);
        return true;
    }
}

module.exports = AmenityDetail;