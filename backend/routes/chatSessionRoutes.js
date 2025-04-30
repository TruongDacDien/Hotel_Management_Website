const express = require('express');
const router = express.Router();

const ChatSession = require('../models/ChatSession');
const ChatSessionService = require('../services/chatSessionService');
const ChatSessionController = require('../controllers/chatSessionController');
const pool = require('../config/database');

const model = new ChatSession(pool);
const service = new ChatSessionService(model);
const controller = new ChatSessionController(service);

// Routes
router.get('/', controller.getAll);
router.get('/:sessionId', controller.getById);
router.post('/', controller.create);
router.put('/:sessionId', controller.update);
router.delete('/:sessionId', controller.delete);

module.exports = router;