import express from "express";
import employeeAccountController from "../controllers/employeeAccountController.js";

const router = express.Router();

router.get('/', employeeAccountController.getAll);
router.get('/:accountId', employeeAccountController.getById);
router.post('/', employeeAccountController.create);
router.put('/:accountId', employeeAccountController.update);
router.delete('/:accountId', employeeAccountController.delete);

export default router;