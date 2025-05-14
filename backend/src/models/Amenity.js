import databaseInstance from "../config/database.js";

class Amenity {
    static pool = databaseInstance.getPool();

    static async getAll() {
        try {
            const [rows] = await this.pool.query("SELECT * FROM TienNghi");
            return rows;
        } catch (error) {
            console.error("Error fetching all amenities:", error);
            throw new Error("Error fetching amenities");
        }
    }

    static async getById(amenityId) {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM TienNghi WHERE MaTienNghi = ?",
                [amenityId]
            );
            if (rows.length === 0) {
                throw new Error("Amenity not found");
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching amenity with ID ${amenityId}:`, error);
            throw new Error("Error fetching amenity");
        }
    }

    static async create(data) {
        try {
            const { name, description, imageUrl, isActive } = data;
            const [result] = await this.pool.query(
                `INSERT INTO TienNghi (TenTienNghi, MoTa, ImageURL, IsActive) VALUES (?, ?, ?, ?)`,
                [name, description, imageUrl, isActive]
            );
            return { id: result.insertId, ...data };
        } catch (error) {
            console.error("Error creating amenity:", error);
            throw new Error("Error creating amenity");
        }
    }

    static async update(amenityId, data) {
        try {
            const { name, description, imageUrl, isActive } = data;
            const [result] = await this.pool.query(
                `UPDATE TienNghi SET TenTienNghi = ?, MoTa = ?, ImageURL = ?, IsActive = ? WHERE MaTienNghi = ?`,
                [name, description, imageUrl, isActive, amenityId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Amenity not found or not updated");
            }
            return { amenityId, ...data };
        } catch (error) {
            console.error(`Error updating amenity with ID ${amenityId}:`, error);
            throw new Error("Error updating amenity");
        }
    }

    static async delete(amenityId) {
        try {
            const [result] = await this.pool.query(
                "DELETE FROM TienNghi WHERE MaTienNghi = ?",
                [amenityId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Amenity not found or not deleted");
            }
            return true;
        } catch (error) {
            console.error(`Error deleting amenity with ID ${amenityId}:`, error);
            throw new Error("Error deleting amenity");
        }
    }
}

export default Amenity;
