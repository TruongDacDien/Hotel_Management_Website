import databaseInstance from "../config/database.js";

class Room {
    static pool = databaseInstance.getPool();

    // Lấy tất cả phòng
    static async getAll() {
        try {
            const [rows] = await this.pool.query('SELECT * FROM Phong');
            return rows;
        } catch (error) {
            console.error("Error fetching all rooms:", error);
            throw new Error("Error fetching all rooms");
        }
    }

    // Lấy phòng theo ID
    static async getById(roomId) {
        try {
            const [rows] = await this.pool.query(
                'SELECT * FROM Phong WHERE SoPhong = ?',
                [roomId]
            );
            if (rows.length === 0) {
                throw new Error("Room not found");
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching room (ID: ${roomId}):`, error);
            throw new Error("Error fetching room");
        }
    }

    // Tạo phòng mới
    static async create(data) {
        try {
            const { roomNumber, roomTypeId, cleanliness, imageUrl, isSelected } = data;
            const [result] = await this.pool.query(
                `INSERT INTO Phong (SoPhong, MaLoaiPhong, DonDep, ImageURL, IsSelected, IsDeleted)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [roomNumber, roomTypeId, cleanliness, imageUrl, isSelected, 0]
            );
            return { SoPhong: result.insertId, ...data };
        } catch (error) {
            console.error("Error creating room:", error);
            throw new Error("Error creating room");
        }
    }

    // Cập nhật phòng
    static async update(roomId, data) {
        try {
            const { roomTypeId, cleanliness, imageUrl, isSelected } = data;
            const [result] = await this.pool.query(
                `UPDATE Phong
                 SET MaLoaiPhong = ?, DonDep = ?, ImageURL = ?, IsSelected = ?
                 WHERE SoPhong = ?`,
                [roomTypeId, cleanliness, imageUrl, isSelected, roomId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Room not found or not updated");
            }
            return { roomId, ...data };
        } catch (error) {
            console.error(`Error updating room (ID: ${roomId}):`, error);
            throw new Error("Error updating room");
        }
    }

    // Xóa phòng
    static async delete(roomId) {
        try {
            const [result] = await this.pool.query(
                'DELETE FROM Phong WHERE SoPhong = ?',
                [roomId]
            );
            if (result.affectedRows === 0) {
                throw new Error("Room not found or not deleted");
            }
            return true;
        } catch (error) {
            console.error(`Error deleting room (ID: ${roomId}):`, error);
            throw new Error("Error deleting room");
        }
    }

    static async getDataRoomByDay(dateSelected) {
        try {
            const query = `
                SELECT ct.MaCTPT,
                       COALESCE(kh.TenKH, '') AS TenKH,
                       p.SoPhong AS MaPhong,
                       p.DonDep AS DonDep,
                       COALESCE(ct.TinhTrangThue, 'Phòng trống') AS TinhTrang,
                       lp.TenLoaiPhong AS LoaiPhong,
                       ct.NgayBD AS NgayDen,
                       CASE 
                           WHEN ct.NgayBD IS NULL OR ct.NgayKT IS NULL THEN 0
                           ELSE CEIL(TIMESTAMPDIFF(MINUTE, ct.NgayBD, ct.NgayKT) / 1440.0)
                       END AS SoNgayO,
                       CASE 
                           WHEN ct.NgayBD IS NULL OR ct.NgayKT IS NULL THEN 0
                           ELSE TIMESTAMPDIFF(MINUTE, ct.NgayBD, ct.NgayKT) / 60
                       END AS SoGio,
                       ct.NgayKT AS NgayDi,
                       COALESCE(ct.SoNguoiO, 0) AS SoNguoi
                FROM Phong p
                LEFT JOIN CT_PhieuThue ct 
                    ON p.SoPhong = ct.SoPhong 
                    AND ((? BETWEEN ct.NgayBD AND ct.NgayKT)
                        OR (ct.NgayBD > ?) 
                        OR ct.NgayBD IS NULL)
                    AND ct.TinhTrangThue <> 'Đã thanh toán'
                LEFT JOIN PhieuThue pt ON ct.MaPhieuThue = pt.MaPhieuThue
                LEFT JOIN KhachHang kh ON pt.MaKH = kh.MaKH
                LEFT JOIN LoaiPhong lp ON p.MaLoaiPhong = lp.MaLoaiPhong
                WHERE p.IsDeleted = 0
            `;

            const [rows] = await this.pool.query(query, [ngayChon, ngayChon]);

            // Map rows to match the Phong_Custom structure
            const result = rows.map(row => ({
                MaCTPT: row.MaCTPT || 0,
                TenKH: row.TenKH,
                MaPhong: row.MaPhong,
                DonDep: row.DonDep,
                TinhTrang: row.TinhTrang,
                LoaiPhong: row.LoaiPhong,
                NgayDen: row.NgayDen ? new Date(row.NgayDen) : null,
                SoNgayO: parseInt(row.SoNgayO, 10),
                SoGio: parseInt(row.SoGio, 10),
                NgayDi: row.NgayDi ? new Date(row.NgayDi) : null,
                SoNguoi: parseInt(row.SoNguoi, 10)
            }));

            return result;
        } catch (error) {
            console.error("Error fetching room data:", error);
            throw new Error("Error fetching room data");
        }
    }

    static async getEmptyRoom(ngayBD, ngayKT) {
        try {
            const query = `
            SELECT p.SoPhong, lp.TenLoaiPhong, lp.MaLoaiPhong
            FROM Phong p
            JOIN LoaiPhong lp ON p.MaLoaiPhong = lp.MaLoaiPhong
            WHERE p.IsDeleted = 0 
            AND p.DonDep NOT IN ('Sửa chữa', 'Chưa dọn dẹp')
            AND p.SoPhong NOT IN (
                SELECT ct.SoPhong
                FROM CT_PhieuThue ct
                WHERE ((ct.NgayBD <= ? AND ct.NgayKT >= ?)) 
                AND ct.TinhTrangThue != 'Đã thanh toán'
            )
        `;

            // Thực hiện truy vấn với các tham số ngayBD và ngayKT
            const [rows] = await this.pool.query(query, [ngayKT, ngayBD]);

            // Map kết quả trả về theo cấu trúc PhongTrong
            const result = rows.map(row => ({
                SoPhong: row.SoPhong,
                MaLoaiPhong: row.MaLoaiPhong,
                TenLoaiPhong: row.TenLoaiPhong
            }));

            return result;
        } catch (error) {
            console.error("Error fetching available rooms:", error);
            throw new Error("Error fetching available rooms");
        }
    }

    static async getEmptyRoomByType(startDay, endDay, roomTypeId) {
        try {
            const query = `
            SELECT p.SoPhong, lp.TenLoaiPhong, lp.MaLoaiPhong, lp.SoNguoiToiDa
            FROM Phong p
            JOIN LoaiPhong lp ON p.MaLoaiPhong = lp.MaLoaiPhong
            WHERE p.IsDeleted = 0
            AND p.DonDep NOT IN ('Sửa chữa', 'Chưa dọn dẹp')
            AND p.SoPhong NOT IN (
                SELECT ct.SoPhong
                FROM CT_PhieuThue ct
                WHERE ((ct.NgayBD <= ? AND ct.NgayKT >= ?)) 
                AND ct.TinhTrangThue != 'Đã thanh toán'
            )
            AND lp.MaLoaiPhong = ?
        `;

            // Thực hiện truy vấn với các tham số ngayBD và ngayKT
            const [rows] = await this.pool.query(query, [startDay, endDay, roomTypeId]);

            // Map kết quả trả về theo cấu trúc PhongTrong
            const result = rows.map(row => ({
                SoPhong: row.SoPhong,
                MaLoaiPhong: row.MaLoaiPhong,
                TenLoaiPhong: row.TenLoaiPhong,
                SoNguoiToiDa: row.SoNguoiToiDa
            }));

            return result;
        } catch (error) {
            console.error("Error fetching available rooms:", error);
            throw new Error("Error fetching available rooms");
        }
    }
}

export default Room;
