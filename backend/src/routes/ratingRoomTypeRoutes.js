import express from "express";
import ratingRoomTypeController from "../controllers/ratingRoomTypeController.js";

const router = express.Router();

router.get("/", ratingRoomTypeController.getAll);
router.get("/:ratingId", ratingRoomTypeController.getById);
router.get("/roomType/:roomTypeId", ratingRoomTypeController.getByRoomTypeId);
router.post("/", ratingRoomTypeController.create);
router.put("/:ratingId", ratingRoomTypeController.update);
router.delete("/:ratingId", ratingRoomTypeController.delete);

export default router;