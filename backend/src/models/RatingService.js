import databaseInstance from "../config/database.js";

class RatingService {
    static pool = databaseInstance.getPool();

    static async getAll() {
        try {
            const [rows] = await this.pool.query('SELECT * FROM DanhGiaDV');
            return rows;
        } catch (error) {
            console.error("Error fetching all ratings:", error);
            throw new Error("Error fetching all ratings");
        }
    }

    static async getById(id) {
        try {
            const [rows] = await this.pool.query('SELECT * FROM DanhGiaDV WHERE MaDGDV = ?', [id]);
            if (rows.length === 0) {
                throw new Error("Role not found");
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching rating (ID: ${id}):`, error);
            throw new Error("Error fetching rating");
        }
    }

    static async getByServiceId(id) {
        try {
            const [rows] = await this.pool.query('SELECT * FROM DanhGiaDV WHERE MaDV = ?', [id]);
            if (rows.length === 0) {
                throw new Error("Role not found");
            }
            return rows;
        } catch (error) {
            console.error(`Error fetching rating (ID: ${id}):`, error);
            throw new Error("Error fetching rating");
        }
    }

    static async create(data) {
        try {
            const { MaDV, MaTKKH, SoSao, NoiDung } = data;
            const [result] = await this.pool.query(
                'INSERT INTO DanhGiaDV (MaDV, MaTKKH, SoSao, NoiDung, ThoiGian) VALUES (?, ?, ?, ?, NOW())',
                [MaDV, MaTKKH, SoSao, NoiDung]
            );
        } catch (error) {
            console.error("Error creating rating:", error);
            throw new Error("Error creating rating");
        }
    }

    static async update(ratingId, data) {
        try {
            const { MaDV, MaTKKH, SoSao, NoiDung } = data;
            const [result] = await this.pool.query(
                `UPDATE DanhGiaDV
                 SET MaDV = ?, MaTKKH = ?, SoSao = ?, NoiDung = ?, ThoiGian = NOW()
                 WHERE MaDGDV = ?`,
                [MaDV, MaTKKH, SoSao, NoiDung, ratingId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Rating not found or not updated");
            }
        } catch (error) {
            console.error(`Error updating rating (ID: ${ratingId}):`, error);
            throw new Error("Error updating role");
        }
    }

    static async delete(id) {
        try {
            const [result] = await this.pool.query(
                'DELETE FROM DanhGiaDV WHERE MaDGDV = ?',
                [id]
            );
            if (result.affectedRows === 0) {
                throw new Error("Rating not found or not deleted");
            }
            return true;
        } catch (error) {
            console.error(`Error deleting rating (ID: ${id}):`, error);
            throw new Error("Error deleting rating");
        }
    }
}

export default RatingService;