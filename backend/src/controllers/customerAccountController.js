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

  findByIdAndUpdatePassword = expressAsyncHandler(async (req, res) => {
    const { accountId, password } = req.params;
    const hashPassword = bcrypt.hashSync(password, 10);
    await CustomerAccountService.findByIdAndUpdatePassword(
      accountId,
      hashPassword
    );
    res.status(204).end();
  });
}

export default new CustomerAccountController();
