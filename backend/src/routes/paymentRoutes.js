import express from "express";
import paymentController from "../controllers/paymentController.js";
import { validateToken } from "../middlewares/verifyToken.js";
import { checkOrderRequestComingFromFrontend } from "../middlewares/checkOrderRequestComingFromFrontend.js";

const router = express.Router();

router.post("/create", validateToken, checkOrderRequestComingFromFrontend, paymentController.createPaymentLink);
router.get("/:orderId", paymentController.getPaymentLinkInfo);
router.put("/:orderId", paymentController.cancelPaymentLink);
router.post("/confirm-webhook", paymentController.confirmWebhook);
router.post("/webhook", paymentController.handleWebhook); // Thêm endpoint webhook

export default router;