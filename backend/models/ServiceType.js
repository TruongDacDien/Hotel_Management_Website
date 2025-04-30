class ServiceType {
    constructor(pool) {
        this.pool = pool;
    }

    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM LoaiDV');
        return rows;
    }

    async getById(serviceTypeId) {
        const [rows] = await this.pool.query(
            'SELECT * FROM LoaiDV WHERE MaLoaiDV = ?',
            [serviceTypeId]
        );
        return rows[0];
    }

    async create(data) {
        const { name, imageUrl } = data;
        await this.pool.query(
            `INSERT INTO LoaiDV (TenLoaiDV, ImageURL, IsDeleted)
             VALUES (?, ?, ?)`,
            [name, imageUrl, 0]
        );
        return data;
    }

    async update(serviceTypeId, data) {
        const { name, imageUrl } = data;
        await this.pool.query(
            `UPDATE LoaiDV
             SET TenLoaiDV = ?, ImageURL = ?
             WHERE MaLoaiDV = ?`,
            [name, imageUrl, serviceTypeId]
        );
        return { serviceTypeId, ...data };
    }

    async delete(serviceTypeId) {
        await this.pool.query(
            'DELETE FROM LoaiDV WHERE MaLoaiDV = ?',
            [serviceTypeId]
        );
        return true;
    }
}

module.exports = ServiceType;