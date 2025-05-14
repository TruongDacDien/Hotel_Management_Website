import express from "express";
import chatHistoryController from "../controllers/chatHistoryController.js";

const router = express.Router();

router.get('/', chatHistoryController.getAllChatHistory);
router.get('/:id', chatHistoryController.getChatHistoryById);
router.get('/session/:sessionId', chatHistoryController.getChatHistoryBySessionId);
router.get('/employee/:employeeId', chatHistoryController.getChatHistoryByEmployeeId);
router.post('/', chatHistoryController.createChatHistory);
router.put('/:id', chatHistoryController.updateChatHistory);
router.delete('/:id', chatHistoryController.deleteChatHistory);

export default router;