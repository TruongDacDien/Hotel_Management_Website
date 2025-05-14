import express from "express";
import serviceTypeController from "../controllers/serviceTypeController.js";

const router = express.Router();

router.get('/', serviceTypeController.getAll);
router.get('/:serviceTypeId', serviceTypeController.getById);
router.post('/', serviceTypeController.create);
router.put('/:serviceTypeId', serviceTypeController.update);
router.delete('/:serviceTypeId', serviceTypeController.delete);

export default router;