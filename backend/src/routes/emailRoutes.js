import express from "express";
import emailController from "../controllers/emailController.js";

const router = express.Router();

router.post("/send-confirm-code", emailController.sendConfirmCode);
router.post("/check-confirm-code", emailController.checkConfirmCode);
router.post("/send-booking-confirmation", emailController.sendBookingConfirmation);
router.post("/send-reset-password", emailController.sendResetPassword);

export default router;