import express from "express";
import ratingServiceController from "../controllers/ratingServiceController.js";

const router = express.Router();

router.get("/", ratingServiceController.getAll);
router.get("/:ratingId", ratingServiceController.getById);
router.post("/", ratingServiceController.create);
router.put("/:ratingId", ratingServiceController.update);
router.delete("/:ratingId", ratingServiceController.delete);

export default router;