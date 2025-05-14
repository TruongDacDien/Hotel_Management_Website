import express from "express";
import roomTypeController from "../controllers/roomTypeController.js";

const router = express.Router();

router.get('/', roomTypeController.getAll);
router.get('/:roomTypeId', roomTypeController.getById);
router.post('/', roomTypeController.create);
router.put('/:roomTypeId', roomTypeController.update);
router.delete('/:roomTypeId', roomTypeController.delete);

export default router;