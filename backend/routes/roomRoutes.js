const express = require('express');
const router = express.Router();

const Room = require('../models/Room');
const RoomService = require('../services/roomService');
const RoomController = require('../controllers/roomController');
const pool = require('../config/database');

const model = new Room(pool);
const service = new RoomService(model);
const controller = new RoomController(service);

// Routes
router.get('/', controller.getAll);
router.get('/:roomId', controller.getById);
router.post('/', controller.create);
router.put('/:roomId', controller.update);
router.delete('/:roomId', controller.delete);

module.exports = router;