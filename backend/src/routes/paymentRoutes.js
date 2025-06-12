import express from "express";
import paymentController from "../controllers/paymentController.js";
import { validateToken } from "../middlewares/verifyToken.js";
import { checkOrderRequestComingFromFrontend } from "../middlewares/checkOrderRequestComingFromFrontend.js";
import CustomerAccount from "../models/CustomerAccount.js";

const router = express.Router();

router.post(
  "/create",
  (req, res, next) => {
    console.log("Đã nhận request:", req.body);
    next();
  },
  //validateToken(CustomerAccount),
  checkOrderRequestComingFromFrontend,
  paymentController.createPaymentLink
);

router.get("/:orderId", paymentController.getPaymentLinkInfo);
router.put("/:orderId", paymentController.cancelPaymentLink);
router.post("/confirm-webhook", paymentController.confirmWebhook);
router.post("/webhook", paymentController.handleWebhook);
router.post("/update-status", paymentController.updateBookingStatusFromReturn);
router.get("/status/:orderCode", paymentController.getBookingStatus);


export default router;