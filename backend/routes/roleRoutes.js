const express = require('express');
const router = express.Router();

const Role = require('../models/Role');
const RoleService = require('../services/roleService');
const RoleController = require('../controllers/roleController');
const pool = require('../config/database');

const model = new Role(pool);
const service = new RoleService(model);
const controller = new RoleController(service);

// Routes
router.get('/', controller.getAll);
router.get('/:roleId', controller.getById);
router.post('/', controller.create);
router.put('/:roleId', controller.update);
router.delete('/:roleId', controller.delete);

module.exports = router;