import express from "express";
import roleController from "../controllers/roleController.js";

const router = express.Router();

router.get('/', roleController.getAll);
router.get('/:roleId', roleController.getById);
router.post('/', roleController.create);
router.put('/:roleId', roleController.update);
router.delete('/:roleId', roleController.delete);

export default router;