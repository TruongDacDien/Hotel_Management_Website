const express = require('express');
const router = express.Router();
const AmenityDetailController = require('../controllers/amenityDetailController');
const AmenityDetailService = require('../services/amenityDetailService');
const AmenityDetail = require('../models/AmenityDetail');
const pool = require('../config/database');

// Initialize dependencies
const amenityDetailModel = new AmenityDetail(pool);
const amenityDetailService = new AmenityDetailService(amenityDetailModel);
const amenityDetailController = new AmenityDetailController(amenityDetailService);

// Define routes
router.get('/', amenityDetailController.getAllAmenityDetails);
router.get('/:id', amenityDetailController.getAmenityDetailById);
router.get('/roomType/:roomTypeId', amenityDetailController.getAmenitiesByRoomType);
router.post('/', amenityDetailController.createAmenityDetail);
router.put('/:id', amenityDetailController.updateAmenityDetail);
router.delete('/:id', amenityDetailController.deleteAmenityDetail);

module.exports = router;