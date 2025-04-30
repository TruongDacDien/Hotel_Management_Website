class Employee {
    constructor(pool) {
        this.pool = pool;
    }

    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM NhanVien');
        return rows;
    }

    async getById(employeeId) {
        const [rows] = await this.pool.query(
            'SELECT * FROM NhanVien WHERE MaNV = ?',
            [employeeId]
        );
        return rows[0];
    }

    async create(data) {
        const { name, position, phone, address, idCard, idCardImage, dateOfBirth, gender, salary } = data;
        await this.pool.query(
            `INSERT INTO NhanVien (HoTen, ChucVu, SDT, DiaChi, CCCD, CCCDImage, NTNS, GioiTinh, Luong, IsDeleted)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, position, phone, address, idCard, idCardImage, dateOfBirth, gender, salary, 0]
        );
        return data;
    }

    async update(employeeId, data) {
        const { name, position, phone, address, idCard, idCardImage, dateOfBirth, gender, salary } = data;
        await this.pool.query(
            `UPDATE NhanVien
             SET HoTen = ?, ChucVu = ?, SDT = ?, DiaChi = ?, CCCD = ?, CCCDImage = ?, NTNS = ?, GioiTinh = ?, Luong = ?
             WHERE MaNV = ?`,
            [name, position, phone, address, idCard, idCardImage, dateOfBirth, gender, salary, employeeId]
        );
        return { employeeId, ...data };
    }

    async delete(employeeId) {
        await this.pool.query(
            'DELETE FROM NhanVien WHERE MaNV = ?',
            [employeeId]
        );
        return true;
    }
}

module.exports = Employee;