import expressAsyncHandler from "express-async-handler";
import { Customer_AuthService, Employee_AuthService } from "./authService.js";

class Customer_AuthController {
  signUp = expressAsyncHandler(async (req, res, next) => {
    const response = await Customer_AuthService.signUp(req.body);
    return res.status(200).json({
      msg: "User created successfully!",
      success: true,
      data: response,
    });
  });

  signIn = expressAsyncHandler(async (req, res, next) => {
    const response = await Customer_AuthService.signIn(req.body);
    res.cookie("refresh_token", response.tokens.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      msg: "User login successfully!",
      success: true,
      data: response,
    });
  });

  signOut = expressAsyncHandler(async (req, res, next) => {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      msg: "Logout success",
      success: true,
    });
  });

  handleRefreshToken = expressAsyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies?.refresh_token;
    const response = await Customer_AuthService.processNewToken(refreshToken);

    res.cookie("refresh_token", response.tokens.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      msg: "Process new token successfully!",
      success: true,
      data: response,
    });
  });

  fetchAccount = expressAsyncHandler(async (req, res, next) => {
    return res.status(200).json({
      msg: "Fetch account successfully!",
      success: true,
      data: await Customer_AuthService.fetchAccount(req),
    });
  });
}

class Employee_AuthController {
  signUp = expressAsyncHandler(async (req, res, next) => {
    const response = await Employee_AuthService.signUp(req.body);
    return res.status(200).json({
      msg: "User created successfully!",
      success: true,
      data: response,
    });
  });

  signIn = expressAsyncHandler(async (req, res, next) => {
    const response = await Employee_AuthService.signIn(req.body);
    res.cookie("refresh_token", response.tokens.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      msg: "User login successfully!",
      success: true,
      data: response,
    });
  });

  signOut = expressAsyncHandler(async (req, res, next) => {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      msg: "Logout success",
      success: true,
    });
  });

  handleRefreshToken = expressAsyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies?.refresh_token;
    const response = await Employee_AuthService.processNewToken(refreshToken);

    res.cookie("refresh_token", response.tokens.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      msg: "Process new token successfully!",
      success: true,
      data: response,
    });
  });

  fetchAccount = expressAsyncHandler(async (req, res, next) => {
    return res.status(200).json({
      msg: "Fetch account successfully!",
      success: true,
      data: await Employee_AuthService.fetchAccount(req),
    });
  });

  validateJWT = expressAsyncHandler(async (req, res, next) => {
    return res.status(200).json({
      msg: "Legit JWT",
      success: true,
    });
  });
}

const customer_AuthController = new Customer_AuthController(), employee_AuthController = new Employee_AuthController();
export { customer_AuthController, employee_AuthController };