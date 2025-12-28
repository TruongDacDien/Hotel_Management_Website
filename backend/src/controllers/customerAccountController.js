import expressAsyncHandler from "express-async-handler";
import CustomerAccountService from "../services/customerAccountService.js";
import { handleUploadCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt";

class CustomerAccountController {
  getAll = expressAsyncHandler(async (req, res) => {
    const data = await CustomerAccountService.getAll();
    res.json(data);
  });

  getById = expressAsyncHandler(async (req, res) => {
    const { accountId } = req.params;
    const item = await CustomerAccountService.getById(accountId);
    res.json(item);
  });

  create = expressAsyncHandler(async (req, res) => {
    const newItem = await CustomerAccountService.create(req.body);
    res.status(201).json(newItem);
  });

  update = expressAsyncHandler(async (req, res) => {
    const { accountId } = req.params; // accountId là user_MaTKKH
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      // Truyền user_MaTKKH làm public_id
      const cldRes = await handleUploadCloudinary(dataURI, `user_${accountId}`);
      req.body.avatarURL = cldRes.url;
      req.body.avatarId = `hotel_management/user_${accountId}`; // Lưu user_MaTKKH thay vì public_id
    }
    const updated = await CustomerAccountService.update(accountId, req.body);
    res.json(updated);
  });

  delete = expressAsyncHandler(async (req, res) => {
    const { accountId } = req.params;
    await CustomerAccountService.delete(accountId);
    res.status(204).end();
  });

  changePassword = expressAsyncHandler(async (req, res) => {
    const { accountId } = req.params;
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("Thiếu currentPassword hoặc newPassword");
    }
    if (String(newPassword).length < 6) {
      res.status(400);
      throw new Error("Mật khẩu mới phải >= 6 ký tự");
    }

    // ⚠️ getById bên service của bạn đang throw "Account not found"
    // nên ta bắt lỗi để trả 404 đúng thay vì 500
    let account = null;
    try {
      account = await CustomerAccountService.getById(accountId);
    } catch (e) {
      res.status(404);
      throw new Error("Không tìm thấy tài khoản");
    }

    // ✅ lấy field mật khẩu linh hoạt (vì DB mỗi người đặt tên khác nhau)
    const storedPassword =
      account?.password ?? account?.Password ?? account?.PASSWORD ?? account?.MatKhau ?? account?.matKhau;

    if (!storedPassword) {
      res.status(500);
      throw new Error(
        "Tài khoản không có trường mật khẩu (password/PASSWORD/MatKhau). Kiểm tra lại model/DB."
      );
    }

    // ✅ Tránh 500 nếu mật khẩu DB đang là plaintext (không phải bcrypt)
    const looksBcrypt =
      typeof storedPassword === "string" && storedPassword.startsWith("$2");

    let ok = false;
    try {
      ok = looksBcrypt
        ? await bcrypt.compare(currentPassword, storedPassword)
        : String(currentPassword) === String(storedPassword);
    } catch (err) {
      res.status(500);
      throw new Error("Lỗi kiểm tra mật khẩu: " + err.message);
    }

    if (!ok) {
      res.status(401);
      throw new Error("Mật khẩu hiện tại không đúng");
    }

    // ✅ giữ format giống hiện tại để khỏi phá login
    // (nếu DB đang dùng bcrypt => lưu bcrypt, nếu đang plaintext => lưu plaintext)
    const nextPassword = looksBcrypt
      ? await bcrypt.hash(String(newPassword), 10)
      : String(newPassword);

    await CustomerAccountService.findByIdAndUpdatePassword(accountId, nextPassword);

    res.json({ message: "Đổi mật khẩu thành công" });
  });
}

export default new CustomerAccountController();
