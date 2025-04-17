class RoomAmenityDetail {
    constructor(pool) {
        this.pool = pool;
    }

    // Get all room amenity details
    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM CT_TienNghi WHERE IsDeleted = 0');
        return rows;
    }

    // Get room amenity detail by ID
    async getById(id) {
        const [rows] = await this.pool.query('SELECT * FROM CT_TienNghi WHERE MaCTTN = ? AND IsDeleted = 0', [id]);
        return rows[0];
    }

    // Get amenities by room number
    async getByRoomNumber(roomNumber) {
        const [rows] = await this.pool.query('SELECT * FROM CT_TienNghi WHERE SoPhong = ? AND IsDeleted = 0', [roomNumber]);
        return rows;
    }

    // Create new room amenity detail
    async create(detailData) {
        const { MaTN, SoPhong, SL, TenTN } = detailData;
        const [result] = await this.pool.query(
            'INSERT INTO CT_TienNghi (MaTN, SoPhong, SL, TenTN, IsDeleted) VALUES (?, ?, ?, ?, 0)',
            [MaTN, SoPhong, SL, TenTN]
        );
        return { MaCTTN: result.insertId, ...detailData };
    }

    // Update room amenity detail
    async update(id, detailData) {
        const { MaTN, SoPhong, SL, TenTN } = detailData;
        await this.pool.query(
            'UPDATE CT_TienNghi SET MaTN = ?, SoPhong = ?, SL = ?, TenTN = ? WHERE MaCTTN = ?',
            [MaTN, SoPhong, SL, TenTN, id]
        );
        return { MaCTTN: id, ...detailData };
    }

    // Soft delete room amenity detail
    async softDelete(id) {
        await this.pool.query('UPDATE CT_TienNghi SET IsDeleted = 1 WHERE MaCTTN = ?', [id]);
        return true;
    }
}

module.exports = RoomAmenityDetail;