import express from "express";
import employeeActivityController from "../controllers/employeeActivityController.js";

const router = express.Router();

router.get('/', employeeActivityController.getAll);
router.get('/:activityId', employeeActivityController.getById);
router.post('/', employeeActivityController.create);
router.put('/:activityId', employeeActivityController.update);
router.delete('/:activityId', employeeActivityController.delete);

export default router;