const express = require('express');
const router = express.Router();

const RoomType = require('../models/RoomType');
const RoomTypeService = require('../services/roomTypeService');
const RoomTypeController = require('../controllers/roomTypeController');
const pool = require('../config/database');

const model = new RoomType(pool);
const service = new RoomTypeService(model);
const controller = new RoomTypeController(service);

// Routes
router.get('/', controller.getAll);
router.get('/:roomTypeId', controller.getById);
router.post('/', controller.create);
router.put('/:roomTypeId', controller.update);
router.delete('/:roomTypeId', controller.delete);

module.exports = router;