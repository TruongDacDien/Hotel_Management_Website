class Amenity {
    constructor(pool) {
        this.pool = pool;
    }

    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM TienNghi');
        return rows;
    }

    async getById(amenityId) {
        const [rows] = await this.pool.query(
            'SELECT * FROM TienNghi WHERE MaTienNghi = ?',
            [amenityId]
        );
        return rows[0];
    }

    async create(data) {
        const { name, description, imageUrl, isActive } = data;
        await this.pool.query(
            `INSERT INTO TienNghi (TenTienNghi, MoTa, ImageURL, IsActive)
             VALUES (?, ?, ?, ?)`,
            [name, description, imageUrl, isActive]
        );
        return data;
    }

    async update(amenityId, data) {
        const { name, description, imageUrl, isActive } = data;
        await this.pool.query(
            `UPDATE TienNghi
             SET TenTienNghi = ?, MoTa = ?, ImageURL = ?, IsActive = ?
             WHERE MaTienNghi = ?`,
            [name, description, imageUrl, isActive, amenityId]
        );
        return { amenityId, ...data };
    }

    async delete(amenityId) {
        await this.pool.query(
            'DELETE FROM TienNghi WHERE MaTienNghi = ?',
            [amenityId]
        );
        return true;
    }
}

module.exports = Amenity;