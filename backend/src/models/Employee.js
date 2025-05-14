import databaseInstance from "../config/database.js";

class Employee {
    static pool = databaseInstance.getPool();

    // Lấy tất cả nhân viên
    static async getAll() {
        try {
            const [rows] = await this.pool.query('SELECT * FROM NhanVien WHERE IsDeleted = 0');
            return rows;
        } catch (error) {
            console.error("Error fetching all employees:", error);
            throw new Error("Error fetching all employees");
        }
    }

    // Lấy nhân viên theo ID
    static async getById(employeeId) {
        try {
            const [rows] = await this.pool.query(
                'SELECT * FROM NhanVien WHERE MaNV = ? AND IsDeleted = 0',
                [employeeId]
            );
            if (rows.length === 0) {
                throw new Error("Employee not found");
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching employee (ID: ${employeeId}):`, error);
            throw new Error("Error fetching employee");
        }
    }

    // Tạo nhân viên mới
    static async create(data) {
        try {
            const { name, position, phone, address, idCard, idCardImage, dateOfBirth, gender, salary } = data;
            const [result] = await this.pool.query(
                `INSERT INTO NhanVien (HoTen, ChucVu, SDT, DiaChi, CCCD, CCCDImage, NTNS, GioiTinh, Luong, IsDeleted)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
                [name, position, phone, address, idCard, idCardImage, dateOfBirth, gender, salary]
            );
            return { MaNV: result.insertId, ...data };
        } catch (error) {
            console.error("Error creating employee:", error);
            throw new Error("Error creating employee");
        }
    }

    // Cập nhật thông tin nhân viên
    static async update(employeeId, data) {
        try {
            const { name, position, phone, address, idCard, idCardImage, dateOfBirth, gender, salary } = data;
            const [result] = await this.pool.query(
                `UPDATE NhanVien SET 
                 HoTen = ?, 
                 ChucVu = ?, 
                 SDT = ?, 
                 DiaChi = ?, 
                 CCCD = ?, 
                 CCCDImage = ?, 
                 NTNS = ?, 
                 GioiTinh = ?, 
                 Luong = ? 
                 WHERE MaNV = ?`,
                [name, position, phone, address, idCard, idCardImage, dateOfBirth, gender, salary, employeeId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Employee not found or not updated");
            }
            return { employeeId, ...data };
        } catch (error) {
            console.error(`Error updating employee (ID: ${employeeId}):`, error);
            throw new Error("Error updating employee");
        }
    }

    // Xóa nhân viên
    static async delete(employeeId) {
        try {
            const [result] = await this.pool.query(
                'DELETE FROM NhanVien WHERE MaNV = ?',
                [employeeId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Employee not found or not deleted");
            }
            return true;
        } catch (error) {
            console.error(`Error deleting employee (ID: ${employeeId}):`, error);
            throw new Error("Error deleting employee");
        }
    }
}

export default Employee;
