import databaseInstance from "../config/database.js";

class Invoice {
    static pool = databaseInstance.getPool();

    // Lấy tất cả hóa đơn
    static async getAll() {
        try {
            const [rows] = await this.pool.query('SELECT * FROM HoaDon');
            return rows;
        } catch (error) {
            console.error("Error fetching all invoices:", error);
            throw new Error("Error fetching all invoices");
        }
    }

    // Lấy hóa đơn theo ID
    static async getById(id) {
        try {
            const [rows] = await this.pool.query(
                'SELECT * FROM HoaDon WHERE MaHD = ?',
                [id]
            );
            if (rows.length === 0) {
                throw new Error("Invoice not found");
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching invoice (ID: ${id}):`, error);
            throw new Error("Error fetching invoice");
        }
    }

    // Lấy hóa đơn theo ID nhân viên
    static async getByEmployeeId(employeeId) {
        try {
            const [rows] = await this.pool.query(
                'SELECT * FROM HoaDon WHERE MaNV = ?',
                [employeeId]
            );
            return rows;
        } catch (error) {
            console.error(`Error fetching invoices by employee ID (${employeeId}):`, error);
            throw new Error("Error fetching invoices by employee ID");
        }
    }

    // Lấy hóa đơn theo ID chi tiết thuê
    static async getByRentalDetailId(rentalDetailId) {
        try {
            const [rows] = await this.pool.query(
                'SELECT * FROM HoaDon WHERE MaCTPT = ?',
                [rentalDetailId]
            );
            return rows;
        } catch (error) {
            console.error(`Error fetching invoices by rental detail ID (${rentalDetailId}):`, error);
            throw new Error("Error fetching invoices by rental detail ID");
        }
    }

    // Tạo mới hóa đơn
    static async create(invoiceData) {
        try {
            const { MaNV, MaCTPT, NgayLap, TongTien } = invoiceData;
            const [result] = await this.pool.query(
                'INSERT INTO HoaDon (MaNV, MaCTPT, NgayLap, TongTien) VALUES (?, ?, ?, ?)',
                [MaNV, MaCTPT, NgayLap, TongTien]
            );
            return { MaHD: result.insertId, ...invoiceData };
        } catch (error) {
            console.error("Error creating invoice:", error);
            throw new Error("Error creating invoice");
        }
    }

    // Cập nhật hóa đơn
    static async update(id, invoiceData) {
        try {
            const { MaNV, MaCTPT, NgayLap, TongTien } = invoiceData;
            const [result] = await this.pool.query(
                'UPDATE HoaDon SET MaNV = ?, MaCTPT = ?, NgayLap = ?, TongTien = ? WHERE MaHD = ?',
                [MaNV, MaCTPT, NgayLap, TongTien, id]
            );
            if (result.affectedRows === 0) {
                throw new Error("Invoice not found or not updated");
            }
            return { MaHD: id, ...invoiceData };
        } catch (error) {
            console.error(`Error updating invoice (ID: ${id}):`, error);
            throw new Error("Error updating invoice");
        }
    }

    // Xóa hóa đơn
    static async delete(id) {
        try {
            const [result] = await this.pool.query(
                'DELETE FROM HoaDon WHERE MaHD = ?',
                [id]
            );
            if (result.affectedRows === 0) {
                throw new Error("Invoice not found or not deleted");
            }
            return true;
        } catch (error) {
            console.error(`Error deleting invoice (ID: ${id}):`, error);
            throw new Error("Error deleting invoice");
        }
    }
}

export default Invoice;
