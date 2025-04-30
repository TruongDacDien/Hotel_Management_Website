class RoomType {
    constructor(pool) {
        this.pool = pool;
    }

    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM LoaiPhong');
        return rows;
    }

    async getById(roomTypeId) {
        const [rows] = await this.pool.query(
            'SELECT * FROM LoaiPhong WHERE MaLoaiPhong = ?',
            [roomTypeId]
        );
        return rows[0];
    }

    async create(data) {
        const { name, description, policy, cancellationPolicy, maxGuests, dailyRate, hourlyRate, imageUrl } = data;
        await this.pool.query(
            `INSERT INTO LoaiPhong (TenLoaiPhong, MoTa, ChinhSach, ChinhSachHuy, SoNguoiToiDa, GiaNgay, GiaGio, ImageURL, IsDeleted)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, policy, cancellationPolicy, maxGuests, dailyRate, hourlyRate, imageUrl, 0]
        );
        return data;
    }

    async update(roomTypeId, data) {
        const { name, description, policy, cancellationPolicy, maxGuests, dailyRate, hourlyRate, imageUrl } = data;
        await this.pool.query(
            `UPDATE LoaiPhong
             SET TenLoaiPhong = ?, MoTa = ?, ChinhSach = ?, ChinhSachHuy = ?, SoNguoiToiDa = ?, GiaNgay = ?, GiaGio = ?, ImageURL = ?
             WHERE MaLoaiPhong = ?`,
            [name, description, policy, cancellationPolicy, maxGuests, dailyRate, hourlyRate, imageUrl, roomTypeId]
        );
        return { roomTypeId, ...data };
    }

    async delete(roomTypeId) {
        await this.pool.query(
            'DELETE FROM LoaiPhong WHERE MaLoaiPhong = ?',
            [roomTypeId]
        );
        return true;
    }
}

module.exports = RoomType;