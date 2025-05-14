import express from "express";
import serviceController from "../controllers/serviceController.js";

const router = express.Router();

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.get('/category/:categoryId', serviceController.getServicesByCategory);
router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);
router.patch('/:id/restore', serviceController.restoreService);

export default router;