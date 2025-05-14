import express from "express";
import nearbyLocationController from "../controllers/nearbyLocationController.js";

const router = express.Router();

router.get('/', nearbyLocationController.getAllNearbyLocations);
router.get('/:id', nearbyLocationController.getNearbyLocationById);
router.get('/branch/:branchId', nearbyLocationController.getLocationsByBranchId);
router.post('/', nearbyLocationController.createNearbyLocation);
router.put('/:id', nearbyLocationController.updateNearbyLocation);
router.delete('/:id', nearbyLocationController.deleteNearbyLocation);
router.post('/fetch', nearbyLocationController.fetchAndSaveNearbyLocations);

export default router;
