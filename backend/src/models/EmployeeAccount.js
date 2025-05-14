import databaseInstance from "../config/database.js";

class EmployeeAccount {
    static pool = databaseInstance.getPool();

    // Lấy tất cả tài khoản nhân viên
    static async getAll() {
        try {
            const [rows] = await this.pool.query('SELECT * FROM TaiKhoanNV WHERE Disabled = 0');
            return rows;
        } catch (error) {
            console.error("Error fetching all employee accounts:", error);
            throw new Error("Error fetching all employee accounts");
        }
    }

    // Lấy tài khoản nhân viên theo ID
    static async getById(accountId) {
        try {
            const [rows] = await this.pool.query(
                'SELECT * FROM TaiKhoanNV WHERE MaTKNV = ? AND Disabled = 0',
                [accountId]
            );
            if (rows.length === 0) {
                throw new Error("Account not found");
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching employee account (ID: ${accountId}):`, error);
            throw new Error("Error fetching employee account");
        }
    }

    // Tạo tài khoản nhân viên mới
    static async create(data) {
        try {
            const { username, password, employeeId, avatar, email, lastLogin, disabled } = data;
            const [result] = await this.pool.query(
                `INSERT INTO TaiKhoanNV (Username, Password, MaNV, Avatar, Email, LastLogin, Disabled)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [username, password, employeeId, avatar, email, lastLogin, disabled]
            );
            return { MaTKNV: result.insertId, ...data };
        } catch (error) {
            console.error("Error creating employee account:", error);
            throw new Error("Error creating employee account");
        }
    }

    // Cập nhật tài khoản nhân viên
    static async update(accountId, data) {
        try {
            const { username, password, avatar, email, lastLogin, disabled } = data;
            const [result] = await this.pool.query(
                `UPDATE TaiKhoanNV
                 SET Username = ?, Password = ?, Avatar = ?, Email = ?, LastLogin = ?, Disabled = ?
                 WHERE MaTKNV = ?`,
                [username, password, avatar, email, lastLogin, disabled, accountId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Account not found or not updated");
            }
            return { accountId, ...data };
        } catch (error) {
            console.error(`Error updating employee account (ID: ${accountId}):`, error);
            throw new Error("Error updating employee account");
        }
    }

    // Xóa tài khoản nhân viên
    static async delete(accountId) {
        try {
            const [result] = await this.pool.query(
                'DELETE FROM TaiKhoanNV WHERE MaTKNV = ?',
                [accountId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Account not found or not deleted");
            }
            return true;
        } catch (error) {
            console.error(`Error deleting employee account (ID: ${accountId}):`, error);
            throw new Error("Error deleting employee account");
        }
    }

    // Lấy tài khoản nhân viên theo ID (kết hợp với thông tin nhân viên)
    static async findById(accountId) {
        try {
            const [rows] = await this.pool.query(
                `SELECT * 
                 FROM NhanVien NV, TaiKhoanNV TKNV
                 WHERE NV.MaNV = TKNV.MaNV AND TKNV.Disabled = 0 AND TKNV.MaTKNV = ?`,
                [accountId]
            );
            return rows[0];
        } catch (error) {
            console.error(`Error fetching employee account by ID (ID: ${accountId}):`, error);
            throw new Error("Error fetching employee account by ID");
        }
    }

    // Tìm nhân viên theo số điện thoại
    static async findEmployeeByPhone(phone) {
        try {
            const [rows] = await this.pool.query(
                `SELECT * 
                 FROM NhanVien NV, TaiKhoanNV TKNV
                 WHERE NV.MaNV = TKNV.MaNV AND TKNV.Disabled = 0 AND NV.SDT = ?`,
                [phone]
            );
            return rows[0];
        } catch (error) {
            console.error(`Error fetching employee by phone (Phone: ${phone}):`, error);
            throw new Error("Error fetching employee by phone");
        }
    }

    // Tìm nhân viên theo email
    static async findEmployeeByEmail(email) {
        try {
            const [rows] = await this.pool.query(
                `SELECT * 
                 FROM NhanVien NV, TaiKhoanNV TKNV
                 WHERE NV.MaNV = TKNV.MaNV AND TKNV.Disabled = 0 AND TKNV.Email = ?`,
                [email]
            );
            return rows[0];
        } catch (error) {
            console.error(`Error fetching employee by email (Email: ${email}):`, error);
            throw new Error("Error fetching employee by email");
        }
    }

    // Kiểm tra tài khoản nhân viên đã tồn tại và bị khóa chưa
    static async findEmployeeByIdentifier(identifier) {
        try {
            const [rows] = await this.pool.query(
                `SELECT *
                 FROM NhanVien NV, TaiKhoanNV TKNV
                 WHERE NV.MaNV = TKNV.MaNV AND TKNV.Disabled = 0 AND (TKNV.Email = ? OR NV.SDT = ? OR TKNV.Username = ?)`,
                [identifier, identifier, identifier]
            );
            return rows[0];
        } catch (error) {
            console.error(`Error checking if employee account exists or is blocked (Identifier: ${identifier}):`, error);
            throw new Error("Error checking employee account status");
        }
    }
}

export default EmployeeAccount;
