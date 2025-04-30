class EmployeeActivity {
    constructor(pool) {
        this.pool = pool;
    }

    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM LichSuHoatDong');
        return rows;
    }

    async getById(activityId) {
        const [rows] = await this.pool.query(
            'SELECT * FROM LichSuHoatDong WHERE MaLSHD = ?',
            [activityId]
        );
        return rows[0];
    }

    async create(data) {
        const { employeeId, action, timestamp } = data;
        await this.pool.query(
            `INSERT INTO LichSuHoatDong (MaNV, HanhDong, ThoiGian)
             VALUES (?, ?, ?)`,
            [employeeId, action, timestamp]
        );
        return data;
    }

    async update(activityId, data) {
        const { employeeId, action, timestamp } = data;
        await this.pool.query(
            `UPDATE LichSuHoatDong
             SET MaNV = ?, HanhDong = ?, ThoiGian = ?
             WHERE MaLSHD = ?`,
            [employeeId, action, timestamp, activityId]
        );
        return { activityId, ...data };
    }

    async delete(activityId) {
        await this.pool.query(
            'DELETE FROM LichSuHoatDong WHERE MaLSHD = ?',
            [activityId]
        );
        return true;
    }
}

module.exports = EmployeeActivity;