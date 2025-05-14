import databaseInstance from "../config/database.js";

class EmployeeActivity {
    static pool = databaseInstance.getPool();

    // Lấy tất cả lịch sử hoạt động của nhân viên
    static async getAll() {
        try {
            const [rows] = await this.pool.query('SELECT * FROM LichSuHoatDong');
            return rows;
        } catch (error) {
            console.error("Error fetching all employee activities:", error);
            throw new Error("Error fetching all employee activities");
        }
    }

    // Lấy lịch sử hoạt động của nhân viên theo ID
    static async getById(activityId) {
        try {
            const [rows] = await this.pool.query(
                'SELECT * FROM LichSuHoatDong WHERE MaLSHD = ?',
                [activityId]
            );
            if (rows.length === 0) {
                throw new Error("Activity not found");
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching employee activity (ID: ${activityId}):`, error);
            throw new Error("Error fetching employee activity");
        }
    }

    // Thêm mới lịch sử hoạt động của nhân viên
    static async create(data) {
        try {
            const { employeeId, action, timestamp } = data;
            const [result] = await this.pool.query(
                `INSERT INTO LichSuHoatDong (MaNV, HanhDong, ThoiGian)
                 VALUES (?, ?, ?)`,
                [employeeId, action, timestamp]
            );
            return { MaLSHD: result.insertId, ...data };
        } catch (error) {
            console.error("Error creating employee activity:", error);
            throw new Error("Error creating employee activity");
        }
    }

    // Cập nhật lịch sử hoạt động của nhân viên
    static async update(activityId, data) {
        try {
            const { employeeId, action, timestamp } = data;
            const [result] = await this.pool.query(
                `UPDATE LichSuHoatDong
                 SET MaNV = ?, HanhDong = ?, ThoiGian = ?
                 WHERE MaLSHD = ?`,
                [employeeId, action, timestamp, activityId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Activity not found or not updated");
            }
            return { activityId, ...data };
        } catch (error) {
            console.error(`Error updating employee activity (ID: ${activityId}):`, error);
            throw new Error("Error updating employee activity");
        }
    }

    // Xóa lịch sử hoạt động của nhân viên
    static async delete(activityId) {
        try {
            const [result] = await this.pool.query(
                'DELETE FROM LichSuHoatDong WHERE MaLSHD = ?',
                [activityId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Activity not found or not deleted");
            }
            return true;
        } catch (error) {
            console.error(`Error deleting employee activity (ID: ${activityId}):`, error);
            throw new Error("Error deleting employee activity");
        }
    }
}

export default EmployeeActivity;
