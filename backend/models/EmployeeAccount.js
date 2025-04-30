class EmployeeAccount {
    constructor(pool) {
        this.pool = pool;
    }

    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM TaiKhoanNV');
        return rows;
    }

    async getById(accountId) {
        const [rows] = await this.pool.query(
            'SELECT * FROM TaiKhoanNV WHERE MaTKNV = ?',
            [accountId]
        );
        return rows[0];
    }

    async create(data) {
        const { username, password, employeeId, avatar, email, lastLogin, disabled } = data;
        await this.pool.query(
            `INSERT INTO TaiKhoanNV (Username, Password, MaNV, Avatar, Email, LastLogin, Disabled)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [username, password, employeeId, avatar, email, lastLogin, disabled]
        );
        return data;
    }

    async update(accountId, data) {
        const { username, password, avatar, email, lastLogin, disabled } = data;
        await this.pool.query(
            `UPDATE TaiKhoanNV
             SET Username = ?, Password = ?, Avatar = ?, Email = ?, LastLogin = ?, Disabled = ?
             WHERE MaTKNV = ?`,
            [username, password, avatar, email, lastLogin, disabled, accountId]
        );
        return { accountId, ...data };
    }

    async delete(accountId) {
        await this.pool.query(
            'DELETE FROM TaiKhoanNV WHERE MaTKNV = ?',
            [accountId]
        );
        return true;
    }
}

module.exports = EmployeeAccount;