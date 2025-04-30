const express = require('express');
const router = express.Router();
const ChatHistoryController = require('../controllers/chatHistoryController');
const ChatHistoryService = require('../services/chatHistoryService');
const ChatHistory = require('../models/ChatHistory');
const pool = require('../config/database');

// Initialize dependencies
const chatHistoryModel = new ChatHistory(pool);
const chatHistoryService = new ChatHistoryService(chatHistoryModel);
const chatHistoryController = new ChatHistoryController(chatHistoryService);

// Define routes
router.get('/', chatHistoryController.getAllChatHistory);
router.get('/:id', chatHistoryController.getChatHistoryById);
router.get('/session/:sessionId', chatHistoryController.getChatHistoryBySessionId);
router.get('/employee/:employeeId', chatHistoryController.getChatHistoryByEmployeeId);
router.post('/', chatHistoryController.createChatHistory);
router.put('/:id', chatHistoryController.updateChatHistory);
router.delete('/:id', chatHistoryController.deleteChatHistory);

module.exports = router;