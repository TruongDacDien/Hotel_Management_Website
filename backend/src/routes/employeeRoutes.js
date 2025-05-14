import express from "express";
import employeeController from "../controllers/employeeController.js";

const router = express.Router();

router.get('/', employeeController.getAll);
router.get('/:employeeId', employeeController.getById);
router.post('/', employeeController.create);
router.put('/:employeeId', employeeController.update);
router.delete('/:employeeId', employeeController.delete);

export default router;