import express from "express";
import roomController from "../controllers/roomController.js";

const router = express.Router();

router.get('/', roomController.getAll);
router.get('/:roomId', roomController.getById);
router.post('/', roomController.create);
router.put('/:roomId', roomController.update);
router.delete('/:roomId', roomController.delete);

export default router;