import express from "express";
import serviceUsageDetailController from "../controllers/serviceUsageDetailController.js";

const router = express.Router();

router.get('/', serviceUsageDetailController.getAll);
router.get('/:bookingId/:serviceId', serviceUsageDetailController.getById);
router.post('/', serviceUsageDetailController.create);
router.put('/:bookingId/:serviceId', serviceUsageDetailController.update);
router.delete('/:bookingId/:serviceId', serviceUsageDetailController.delete);

export default router;
