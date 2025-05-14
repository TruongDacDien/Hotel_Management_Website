import express from "express";
import chatSessionController from "../controllers/chatSessionController.js";

const router = express.Router();

router.get('/', chatSessionController.getAll);
router.get('/:sessionId', chatSessionController.getById);
router.post('/', chatSessionController.create);
router.put('/:sessionId', chatSessionController.update);
router.delete('/:sessionId', chatSessionController.delete);

export default router;