// routes/branchRoutes.js
const express = require('express');
const router = express.Router();
const BranchController = require('../controllers/branchController');
const BranchService = require('../services/branchService');
const Branch = require('../models/branch')
const pool = require('../config/database');

// Khởi tạo dependency
const branchModel = new Branch(pool);
const branchService = new BranchService(branchModel);
const branchController = new BranchController(branchService);

// Định tuyến
router.get('/', branchController.getAllBranches);
router.get('/:id', branchController.getBranchById);
router.post('/', branchController.createBranch);
router.put('/:id', branchController.updateBranch);
router.delete('/:id', branchController.deleteBranch);

module.exports = router;