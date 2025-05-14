import express from "express";
import amenityDetailController from "../controllers/amenityDetailController.js";

const router = express.Router();

router.get('/', amenityDetailController.getAllAmenityDetails);
router.get('/:id', amenityDetailController.getAmenityDetailById);
router.get('/roomType/:roomTypeId', amenityDetailController.getAmenitiesByRoomType);
router.post('/', amenityDetailController.createAmenityDetail);
router.put('/:id', amenityDetailController.updateAmenityDetail);
router.delete('/:id', amenityDetailController.deleteAmenityDetail);

export default router;