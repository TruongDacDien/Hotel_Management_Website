import express from "express";
import customerAccountController from "../controllers/customerAccountController.js";
import { upload } from "../middlewares/cloudinary_multer.js";

const router = express.Router();

router.get('/', customerAccountController.getAll);
router.get('/:accountId', customerAccountController.getById);
router.post('/', customerAccountController.create);
router.put('/:accountId', upload.single("avatarFile"),customerAccountController.update);
router.delete('/:accountId', customerAccountController.delete);
router.put('/update-password', customerAccountController.findByIdAndUpdatePassword)

export default router;