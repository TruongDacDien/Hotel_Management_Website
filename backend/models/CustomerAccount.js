class CustomerAccount {
    constructor(pool) {
        this.pool = pool;
    }

    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM TaiKhoanKH');
        return rows;
    }

    async getById(accountId) {
        const [rows] = await this.pool.query(
            'SELECT * FROM TaiKhoanKH WHERE MaTKKH = ?',
            [accountId]
        );
        return rows[0];
    }

    async create(data) {
        const { username, password, email, avatar, customerId, lastLogin, disabled } = data;
        await this.pool.query(
            `INSERT INTO TaiKhoanKH (Username, Password, Email, Avatar, MaKH, LastLogin, Disabled)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [username, password, email, avatar, customerId, lastLogin, disabled]
        );
        return data;
    }

    async update(accountId, data) {
        const { username, password, email, avatar, lastLogin, disabled } = data;
        await this.pool.query(
            `UPDATE TaiKhoanKH
             SET Username = ?, Password = ?, Email = ?, Avatar = ?, LastLogin = ?, Disabled = ?
             WHERE MaTKKH = ?`,
            [username, password, email, avatar, lastLogin, disabled, accountId]
        );
        return { accountId, ...data };
    }

    async delete(accountId) {
        await this.pool.query(
            'DELETE FROM TaiKhoanKH WHERE MaTKKH = ?',
            [accountId]
        );
        return true;
    }
}

module.exports = CustomerAccount;