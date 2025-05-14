import express from "express";
import { customer_AuthController, employee_AuthController } from "./authController.js";
import { validateToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/customer/sign-in", customer_AuthController.signIn);
router.post("/customer/sign-up", customer_AuthController.signUp);
router.get("/customer/sign-out", customer_AuthController.signOut);
router.post("/customer/refresh-token", customer_AuthController.handleRefreshToken);
router.get("/customer/account", validateToken, customer_AuthController.fetchAccount);

router.post("/employee/validateJWT", validateToken, employee_AuthController.validateJWT);
router.post("/employee/sign-in", employee_AuthController.signIn);
router.get("/employee/sign-out", employee_AuthController.signOut);

export default router;