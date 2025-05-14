import express from "express";
import bookingDetailController from "../controllers/bookingDetailController.js";

const router = express.Router();

router.get('/', bookingDetailController.getAll);
router.get('/:bookingId/:roomId', bookingDetailController.getById);
router.post('/', bookingDetailController.create);
router.put('/:bookingId/:roomId', bookingDetailController.update);
router.delete('/:bookingId/:roomId', bookingDetailController.delete);

export default router;