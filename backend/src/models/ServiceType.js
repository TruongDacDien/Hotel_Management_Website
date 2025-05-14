import databaseInstance from "../config/database.js";

class ServiceType {
    static pool = databaseInstance.getPool();

    // Lấy tất cả loại dịch vụ
    static async getAll() {
        try {
            const [rows] = await this.pool.query("SELECT * FROM LoaiDV");
            return rows;
        } catch (error) {
            console.error("Error fetching all service types:", error);
            throw new Error("Error fetching all service types");
        }
    }

    // Lấy loại dịch vụ theo ID
    static async getById(serviceTypeId) {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM LoaiDV WHERE MaLoaiDV = ?",
                [serviceTypeId]
            );
            if (rows.length === 0) {
                throw new Error("Service type not found");
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching service type (ID: ${serviceTypeId}):`, error);
            throw new Error("Error fetching service type");
        }
    }

    // Tạo loại dịch vụ mới
    static async create(data) {
        try {
            const { name, imageUrl } = data;
            const [result] = await this.pool.query(
                `INSERT INTO LoaiDV (TenLoaiDV, ImageURL, IsDeleted)
                 VALUES (?, ?, ?)`,
                [name, imageUrl, 0]
            );
            return { MaLoaiDV: result.insertId, ...data };
        } catch (error) {
            console.error("Error creating service type:", error);
            throw new Error("Error creating service type");
        }
    }

    // Cập nhật loại dịch vụ
    static async update(serviceTypeId, data) {
        try {
            const { name, imageUrl } = data;
            const [result] = await this.pool.query(
                `UPDATE LoaiDV
                 SET TenLoaiDV = ?, ImageURL = ?
                 WHERE MaLoaiDV = ?`,
                [name, imageUrl, serviceTypeId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Service type not found or not updated");
            }
            return { serviceTypeId, ...data };
        } catch (error) {
            console.error(`Error updating service type (ID: ${serviceTypeId}):`, error);
            throw new Error("Error updating service type");
        }
    }

    // Xóa loại dịch vụ
    static async delete(serviceTypeId) {
        try {
            const [result] = await this.pool.query(
                "DELETE FROM LoaiDV WHERE MaLoaiDV = ?",
                [serviceTypeId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Service type not found or not deleted");
            }
            return true;
        } catch (error) {
            console.error(`Error deleting service type (ID: ${serviceTypeId}):`, error);
            throw new Error("Error deleting service type");
        }
    }
}

export default ServiceType;
