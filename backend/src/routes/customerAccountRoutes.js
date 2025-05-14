import express from "express";
import customerAccountController from "../controllers/customerAccountController.js";

const router = express.Router();

router.get('/', customerAccountController.getAll);
router.get('/:accountId', customerAccountController.getById);
router.post('/', customerAccountController.create);
router.put('/:accountId', customerAccountController.update);
router.delete('/:accountId', customerAccountController.delete);

export default router;