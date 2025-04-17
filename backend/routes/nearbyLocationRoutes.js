const express = require('express');
const router = express.Router();
const NearbyLocationController = require('../controllers/nearbyLocationController');
const NearbyLocationService = require('../services/nearbyLocationService');
const NearbyLocation = require('../models/NearbyLocation');
const pool = require('../config/database');

// Initialize dependencies
const nearbyLocationModel = new NearbyLocation(pool);
const nearbyLocationService = new NearbyLocationService(nearbyLocationModel);
const nearbyLocationController = new NearbyLocationController(nearbyLocationService);

// Define routes
router.get('/', nearbyLocationController.getAllNearbyLocations);
router.get('/:id', nearbyLocationController.getNearbyLocationById);
router.get('/branch/:branchId', nearbyLocationController.getLocationsByBranchId);
router.post('/', nearbyLocationController.createNearbyLocation);
router.put('/:id', nearbyLocationController.updateNearbyLocation);
router.delete('/:id', nearbyLocationController.deleteNearbyLocation);

module.exports = router;