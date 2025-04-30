const express = require('express');
const router = express.Router();

const Amenity = require('../models/Amenity');
const AmenityService = require('../services/amenityService');
const AmenityController = require('../controllers/amenityController');
const pool = require('../config/database');

const model = new Amenity(pool);
const service = new AmenityService(model);
const controller = new AmenityController(service);

// Routes
router.get('/', controller.getAll);
router.get('/:amenityId', controller.getById);
router.post('/', controller.create);
router.put('/:amenityId', controller.update);
router.delete('/:amenityId', controller.delete);

module.exports = router;