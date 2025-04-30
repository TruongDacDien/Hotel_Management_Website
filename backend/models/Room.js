class Room {
    constructor(pool) {
        this.pool = pool;
    }

    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM Phong');
        return rows;
    }

    async getById(roomId) {
        const [rows] = await this.pool.query(
            'SELECT * FROM Phong WHERE SoPhong = ?',
            [roomId]
        );
        return rows[0];
    }

    async create(data) {
        const { roomNumber, roomTypeId, cleanliness, imageUrl, isSelected } = data;
        await this.pool.query(
            `INSERT INTO Phong (SoPhong, MaLoaiPhong, DonDep, ImageURL, IsSelected, IsDeleted)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [roomNumber, roomTypeId, cleanliness, imageUrl, isSelected, 0]
        );
        return data;
    }

    async update(roomId, data) {
        const { roomTypeId, cleanliness, imageUrl, isSelected } = data;
        await this.pool.query(
            `UPDATE Phong
             SET MaLoaiPhong = ?, DonDep = ?, ImageURL = ?, IsSelected = ?
             WHERE SoPhong = ?`,
            [roomTypeId, cleanliness, imageUrl, isSelected, roomId]
        );
        return { roomId, ...data };
    }

    async delete(roomId) {
        await this.pool.query(
            'DELETE FROM Phong WHERE SoPhong = ?',
            [roomId]
        );
        return true;
    }
}

module.exports = Room;