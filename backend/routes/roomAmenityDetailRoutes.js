const express = require('express');
const router = express.Router();
const RoomAmenityDetailController = require('../controllers/roomAmenityDetailController');
const RoomAmenityDetailService = require('../services/roomAmenityDetailService');
const RoomAmenityDetail = require('../models/RoomAmenityDetail');
const pool = require('../config/database');

// Initialize dependencies
const roomAmenityDetailModel = new RoomAmenityDetail(pool);
const roomAmenityDetailService = new RoomAmenityDetailService(roomAmenityDetailModel);
const roomAmenityDetailController = new RoomAmenityDetailController(roomAmenityDetailService);

// Define routes
router.get('/', roomAmenityDetailController.getAllRoomAmenityDetails);
router.get('/:id', roomAmenityDetailController.getRoomAmenityDetailById);
router.get('/room/:roomNumber', roomAmenityDetailController.getAmenitiesByRoomNumber);
router.post('/', roomAmenityDetailController.createRoomAmenityDetail);
router.put('/:id', roomAmenityDetailController.updateRoomAmenityDetail);
router.delete('/:id', roomAmenityDetailController.deleteRoomAmenityDetail);

module.exports = router;