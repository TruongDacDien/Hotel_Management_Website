import express from "express";
import paymentController from "../controllers/paymentController.js";
import { validateToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create",validateToken, paymentController.createPaymentLink);
router.get("/:orderId", paymentController.getPaymentLinkInfo);
router.put("/:orderId", paymentController.cancelPaymentLink);
router.post("/confirm-webhook", paymentController.confirmWebhook);

export default router;