import databaseInstance from "../config/database.js";

class AmenityDetail {
    static pool = databaseInstance.getPool();

    // Get all amenity details
    static async getAll() {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM CT_TienNghi WHERE IsDeleted = 0"
            );
            return rows;
        } catch (error) {
            console.error("Error fetching all amenity details:", error);
            throw new Error("Error fetching amenity details");
        }
    }

    // Get amenity detail by ID
    static async getById(id) {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM CT_TienNghi WHERE MaCTTN = ? AND IsDeleted = 0",
                [id]
            );
            if (rows.length === 0) {
                throw new Error("Amenity detail not found");
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching amenity detail with ID ${id}:`, error);
            throw new Error("Error fetching amenity detail");
        }
    }

    // Get amenities by room type
    static async getByRoomType(roomTypeId) {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM CT_TienNghi WHERE MaLoaiPhong = ? AND IsDeleted = 0",
                [roomTypeId]
            );
            return rows;
        } catch (error) {
            console.error(`Error fetching amenities for room type ID ${roomTypeId}:`, error);
            throw new Error("Error fetching amenities by room type");
        }
    }

    // Create new amenity detail
    static async create(detailData) {
        try {
            const { MaTN, MaLoaiPhong, SL, TenTN } = detailData;
            const [result] = await this.pool.query(
                "INSERT INTO CT_TienNghi (MaTN, MaLoaiPhong, SL, TenTN, IsDeleted) VALUES (?, ?, ?, ?, 0)",
                [MaTN, MaLoaiPhong, SL, TenTN]
            );
            return { MaCTTN: result.insertId, ...detailData };
        } catch (error) {
            console.error("Error creating amenity detail:", error);
            throw new Error("Error creating amenity detail");
        }
    }

    // Update amenity detail
    static async update(id, detailData) {
        try {
            const { MaTN, MaLoaiPhong, SL, TenTN } = detailData;
            const [result] = await this.pool.query(
                "UPDATE CT_TienNghi SET MaTN = ?, MaLoaiPhong = ?, SL = ?, TenTN = ? WHERE MaCTTN = ? AND IsDeleted = 0",
                [MaTN, MaLoaiPhong, SL, TenTN, id]
            );
            if (result.affectedRows === 0) {
                throw new Error("Amenity detail not found or not updated");
            }
            return { MaCTTN: id, ...detailData };
        } catch (error) {
            console.error(`Error updating amenity detail with ID ${id}:`, error);
            throw new Error("Error updating amenity detail");
        }
    }

    // Soft delete amenity detail
    static async softDelete(id) {
        try {
            const [result] = await this.pool.query(
                "UPDATE CT_TienNghi SET IsDeleted = 1 WHERE MaCTTN = ?",
                [id]
            );
            if (result.affectedRows === 0) {
                throw new Error("Amenity detail not found or not deleted");
            }
            return true;
        } catch (error) {
            console.error(`Error soft deleting amenity detail with ID ${id}:`, error);
            throw new Error("Error soft deleting amenity detail");
        }
    }
}

export default AmenityDetail;
