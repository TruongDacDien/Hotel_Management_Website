import express from "express";
import amenityController from "../controllers/amenityController.js";

const router = express.Router();

router.get('/', amenityController.getAll);
router.get('/:amenityId', amenityController.getById);
router.post('/', amenityController.create);
router.put('/:amenityId', amenityController.update);
router.delete('/:amenityId', amenityController.delete);

export default router;