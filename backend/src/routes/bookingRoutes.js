import express from "express";
import bookingController from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", bookingController.getAll);
router.post("/customerOrder", bookingController.customerOrder);
router.get("/history", bookingController.getAllCustomerOrder);
router.get("/:bookingId", bookingController.getById);
router.post("/", bookingController.create);
router.put("/:bookingId", bookingController.update);
router.delete("/:bookingId", bookingController.delete);

export default router;
