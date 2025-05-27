import databaseInstance from "../config/database.js";
import bcrypt from "bcrypt";
import { handleDestroyCloudinary } from "../utils/cloudinary.js";

class CustomerAccount {
  static pool = databaseInstance.getPool();

  // Lấy tất cả tài khoản khách hàng
  static async getAll() {
    try {
      const [rows] = await this.pool.query("SELECT * FROM TaiKhoanKH");
      return rows;
    } catch (error) {
      console.error("Error fetching all customer accounts:", error);
      throw new Error("Error fetching all customer accounts");
    }
  }

  // Lấy tài khoản khách hàng theo ID
  static async getById(accountId) {
    try {
      const [rows] = await this.pool.query(
        "SELECT * FROM TaiKhoanKH WHERE MaTKKH = ?",
        [accountId]
      );
      if (rows.length === 0) {
        throw new Error("Account not found");
      }
      return rows[0];
    } catch (error) {
      console.error(`Error fetching account (ID: ${accountId}):`, error);
      throw new Error("Error fetching account");
    }
  }

  // Tạo tài khoản khách hàng mới
  static async create(data) {
    const connection = await this.pool.getConnection(); // Lấy kết nối từ pool
    try {
      // Bắt đầu giao dịch
      await connection.beginTransaction();

      // 1. Tạo bản ghi trong bảng KhachHang
      const { fullname, phone } = data;
      const [customerResult] = await connection.query(
        `INSERT INTO KhachHang (TenKH, GioiTinh, CCCD, CCCDImage, SDT, DiaChi, QuocTich, IsDeleted)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [fullname, null, null, null, phone, null, "Việt Nam", 0]
      );
      const customerId = customerResult.insertId; // Lấy MaKH vừa tạo

      // 2. Tạo bản ghi trong bảng TaiKhoanKH với MaKH vừa tạo
      const { username, password, email } = data;
      const hashPassword = bcrypt.hashSync(password, 10);
      const [accountResult] = await connection.query(
        `INSERT INTO TaiKhoanKH (Username, Password, Email, AvatarId, AvatarURL, MaKH, LastLogin, Disabled)
                 VALUES (?, ?, ?, ?, ?, NOW(), 0)`,
        [
          username,
          hashPassword,
          email,
          "user_default_m4o3wc",
          "https://res.cloudinary.com/dzaoyffio/image/upload/v1747814352/user_default_m4o3wc.png",
          customerId,
        ]
      );

      // Commit giao dịch
      await connection.commit();

      return { MaTKKH: accountResult.insertId, MaKH: customerId, ...data };
    } catch (error) {
      // Rollback giao dịch nếu có lỗi
      await connection.rollback();
      console.error("Error creating customer account:", error);
      throw new Error("Error creating customer account");
    } finally {
      // Giải phóng kết nối
      connection.release();
    }
  }

  // Cập nhật tài khoản khách hàng
  static async update(accountId, data) {
    try {
      const { password, email, avatarId, avatarURL, fullName, phone, identification, address, sex, country } = data;
      const hashPassword = bcrypt.hashSync(password, 10);
      const account = await this.findById(accountId);
      handleDestroyCloudinary(account.AvatarId);
      const [result1] = await this.pool.query(
        `UPDATE TaiKhoanKH
                 SET Password = ?, Email = ?, AvatarId = ?, AvatarURL = ?
                 WHERE MaTKKH = ?`,
        [hashPassword, email, avatarId, avatarURL, accountId]
      );
      const [result2] = await this.pool.query(
        `UPDATE KhachHang
                 SET TenKH = ?, SDT = ?, CCCD = ?, DiaChi = ?, GioiTinh = ?, QuocTich = ?
                 WHERE MaKH = ?`,
        [fullName, phone, identification, address, sex, country, account.MaKH]
      );
      if (result1.affectedRows === 0 && result2.affectedRows === 0) {
        throw new Error("Account not found or not updated");
      }
    } catch (error) {
      console.error(`Error updating account (ID: ${accountId}):`, error);
      throw new Error("Error updating account");
    }
  }

  // Xóa tài khoản khách hàng
  static async delete(accountId) {
    try {
      const [result] = await this.pool.query(
        "DELETE FROM TaiKhoanKH WHERE MaTKKH = ?",
        [accountId]
      );
      if (result.affectedRows === 0) {
        throw new Error("Account not found or not deleted");
      }
      return true;
    } catch (error) {
      console.error(`Error deleting account (ID: ${accountId}):`, error);
      throw new Error("Error deleting account");
    }
  }

  // Tìm tài khoản khách hàng theo ID
  static async findById(accountId) {
    try {
      const [rows] = await this.pool.query(
        `SELECT * 
                 FROM KhachHang KH, TaiKhoanKH TKKH
                 WHERE KH.MaKH = TKKH.MaKH AND TKKH.Disabled = 0 AND TKKH.MaTKKH = ?`,
        [accountId]
      );
      if (rows.length === 0) {
        throw new Error("Account or customer not found");
      }
      return rows[0];
    } catch (error) {
      console.error(`Error fetching account by ID (ID: ${accountId}):`, error);
      throw new Error("Error fetching account by ID");
    }
  }

  // Tìm tài khoản khách hàng theo số điện thoại
  static async findUserByPhone(phone) {
    try {
      const [rows] = await this.pool.query(
        `SELECT * 
                 FROM KhachHang KH, TaiKhoanKH TKKH 
                 WHERE KH.MaKH = TKKH.MaKH AND TKKH.Disabled = 0 AND KH.SDT = ?`,
        [phone]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(
        `Error fetching account by phone (Phone: ${phone}):`,
        error
      );
      throw new Error("Error fetching account by phone");
    }
  }

  // Tìm tài khoản khách hàng theo email
  static async findUserByEmail(email) {
    try {
      const [rows] = await this.pool.query(
        `SELECT * 
                 FROM KhachHang KH, TaiKhoanKH TKKH
                 WHERE KH.MaKH = TKKH.MaKH AND TKKH.Disabled = 0 AND TKKH.Email = ?`,
        [email]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(
        `Error fetching account by email (Email: ${email}):`,
        error
      );
      throw new Error("Error fetching account by email");
    }
  }

  // Kiểm tra tài khoản đã tồn tại và bị khóa
  static async findCustomerByIdentifier(identifier) {
    try {
      const [rows] = await this.pool.query(
        `SELECT *
                 FROM KhachHang KH, TaiKhoanKH TKKH
                 WHERE KH.MaKH = TKKH.MaKH AND TKKH.Disabled = 0 AND (TKKH.Email = ? OR KH.SDT = ? OR TKKH.Username = ?)`,
        [identifier, identifier, identifier]
      );
      if (rows.length === 0) {
        throw new Error("User does not exist or is blocked");
      }
      return rows[0];
    } catch (error) {
      console.error(
        `Error checking existence and blocked user (Identifier: ${identifier}):`,
        error
      );
      throw new Error("Error checking user existence or blocked status");
    }
  }

  // Tìm và cập nhật tài khoản khách hàng theo email
  static async findByEmailAndUpdate(email, updateData) {
    try {
      const account = await this.findUserByEmail(email);
      return await this.update(account.MaTKKH, updateData);
    } catch (error) {
      console.error(
        `Error finding and updating account by email (Email: ${email}):`,
        error
      );
      throw new Error("Error updating account by email");
    }
  }

  static async findByIdAndUpdatePassword(accountId, hashPassword) {
    try {
      const [result] = await this.pool.query(
        `UPDATE TaiKhoanKH
                 SET Password = ?
                 WHERE MaTKKH = ?`,
        [hashPassword, accountId]
      );
      if (result.affectedRows === 0) {
        throw new Error("Account not found or can not updated");
        w;
      }
    } catch (error) {
      console.error(
        `Error finding and updating account by ID (ID: ${accountId}):`,
        error
      );
      throw new Error("Error updating account by ID");
    }
  }

  static async findByEmailAndUpdateVerificationCode(
    email,
    verification,
    expirationTime
  ) {
    try {
      const [result] = await this.pool.query(
        `UPDATE TaiKhoanKH
                 SET MaXacNhan = ?, ThoiGianHetHan= ?
                 WHERE Email = ?`,
        [verification, expirationTime, email]
      );
      if (result.affectedRows === 0) {
        throw new Error("Account not found or can not updated");
        w;
      }
    } catch (error) {
      console.error(
        `Error finding and updating account by email (Email: ${email}):`,
        error
      );
      throw new Error("Error updating account by email");
    }
  }
}

export default CustomerAccount;
