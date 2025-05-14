import databaseInstance from "../config/database.js";

class Role {
    static pool = databaseInstance.getPool();

    // Lấy tất cả phân quyền
    static async getAll() {
        try {
            const [rows] = await this.pool.query('SELECT * FROM PhanQuyen');
            return rows;
        } catch (error) {
            console.error("Error fetching all roles:", error);
            throw new Error("Error fetching all roles");
        }
    }

    // Lấy phân quyền theo ID
    static async getById(roleId) {
        try {
            const [rows] = await this.pool.query('SELECT * FROM PhanQuyen WHERE MaPQ = ?', [roleId]);
            if (rows.length === 0) {
                throw new Error("Role not found");
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching role (ID: ${roleId}):`, error);
            throw new Error("Error fetching role");
        }
    }

    // Tạo phân quyền mới
    static async create(data) {
        try {
            const { accountId, permissions } = data;
            const [result] = await this.pool.query(
                `INSERT INTO PhanQuyen (MaTKNV, TrangChu, Phong, DatPhong, HoaDon, 
                QLKhachHang, QLPhong, QLLoaiPhong, QLDichVu, QLLoaiDichVu, 
                QLTienNghi, QLNhanVien, QLTaiKhoan, ThongKe, ThongBao, LichSuHoatDong)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [accountId, ...permissions]
            );
            return { MaPQ: result.insertId, ...data };
        } catch (error) {
            console.error("Error creating role:", error);
            throw new Error("Error creating role");
        }
    }

    // Cập nhật phân quyền
    static async update(roleId, data) {
        try {
            const { accountId, permissions } = data;
            const [result] = await this.pool.query(
                `UPDATE PhanQuyen
                 SET MaTKNV = ?, TrangChu = ?, Phong = ?, DatPhong = ?, HoaDon = ?, 
                     QLKhachHang = ?, QLPhong = ?, QLLoaiPhong = ?, QLDichVu = ?, 
                     QLLoaiDichVu = ?, QLTienNghi = ?, QLNhanVien = ?, QLTaiKhoan = ?, 
                     ThongKe = ?, ThongBao = ?, LichSuHoatDong = ?
                 WHERE MaPQ = ?`,
                [accountId, ...permissions, roleId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Role not found or not updated");
            }
            return { roleId, ...data };
        } catch (error) {
            console.error(`Error updating role (ID: ${roleId}):`, error);
            throw new Error("Error updating role");
        }
    }

    // Xóa phân quyền
    static async delete(roleId) {
        try {
            const [result] = await this.pool.query('DELETE FROM PhanQuyen WHERE MaPQ = ?', [roleId]);
            if (result.affectedRows === 0) {
                throw new Error("Role not found or not deleted");
            }
            return true;
        } catch (error) {
            console.error(`Error deleting role (ID: ${roleId}):`, error);
            throw new Error("Error deleting role");
        }
    }

    // Lấy tất cả quyền của nhân viên theo tài khoản
    static async getAllPermissionOfEmployeeFunction(accountId) {
        try {
            const [rows] = await this.pool.query('SELECT * FROM PhanQuyen WHERE MaTKNV = ?', [accountId]);
            return rows[0];
        } catch (error) {
            console.error(`Error fetching permissions for employee (Account ID: ${accountId}):`, error);
            throw new Error("Error fetching permissions for employee");
        }
    }
}

export default Role;
