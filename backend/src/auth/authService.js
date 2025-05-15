import { customError } from "../middlewares/errorHandlers.js";
import roleService from "../services/roleService.js";
import CustomerAccount from "../models/CustomerAccount.js";
import EmployeeAccount from "../models/EmployeeAccount.js";
import customerAccountService from "../services/customerAccountService.js";
import employeeAccountService from "../services/employeeAccountService.js";
import JwtService from "./jwt/jwtService.js";
import bcrypt from "bcrypt";

export class Customer_AuthService {
  static signUp = async (userdata) => {
    console.log(userdata);
    const { password, confirmPassword, phone, email } = userdata;
    console.log(password);
    if (password !== confirmPassword) {
      throw customError("Mật khẩu không khớp ", 400);
    }

    const existingUserPhone = await customerAccountService.findUserByPhone(phone);
    if (existingUserPhone) {
      throw customError("Số điện thoại đã được đăng ký!", 400);
    }

    const existingUserEmail = await customerAccountService.findUserByEmail(email);
    if (existingUserEmail) {
      throw customError("Email đã được đăng ký!", 400);
    }

    return await CustomerAccount.create(userdata);
  };

  static signIn = async ({ identifier, password }) => {
    const user = await customerAccountService.findCustomerByIdentifier(identifier);
    if (!user) {
      throw customError("User not found", 400);
    }
    const isMatch = Customer_AuthService.checkPassword(password, user.Password);
    if (!isMatch) {
      throw customError("Password is incorrect", 400);
    }
    let payload = {
      id: user.MaTKKH,
      name: user.TenKH,
      email: user.Email,
      phone: user.SDT,
      birth: user.NTNS,
    };
    let tokens = JwtService.createJWT(payload);

    return {
      id: user.MaTKKH,
      name: user.TenKH,
      email: user.Email,
      phone: user.SDT,
      birth: user.NTNS,
      tokens,
    };
  };

  static processNewToken = async (refreshToken) => {
    const decoded = JwtService.verifyRTToken(refreshToken);

    if (!decoded) {
      throw customError("Invalid or expired refresh token", 403);
    }
    const payload = {
      id: decoded.MaTKKH,
      name: decoded.TenKH,
      email: decoded.Email,
      phone: decoded.SDT,
      birth: decoded.NTNS,
    };

    const newTokens = JwtService.createJWT(payload);

    return {
      id: decoded.MaTKKH,
      name: decoded.TenKH,
      email: decoded.Email,
      phone: decoded.SDT,
      birth: decoded.NTNS,
      tokens: newTokens,
    };
  };

  static checkPassword = (inputPassword, hashPassword) => {
    console.log(inputPassword, hashPassword);
    return bcrypt.compareSync(inputPassword, hashPassword); // true
  };

  static fetchAccount = async (req) => {
    const accessToken = this.getAccessTokenFromHeader(req);
    if (!accessToken) throw customError("Invalid or expired access token", 401);

    const decoded = JwtService.verifyATToken(accessToken);

    if (!decoded) {
      throw customError("Invalid or expired access token", 401);
    }

    const user = await CustomerAccount.findById(decoded.MaTKKH);

    const payload = {
      id: user.MaTKKH,
      name: user.TenKH,
      email: user.Email,
      phone: user.SDT,
      birth: user.NTNS,
    };

    return {
      ...payload,
    };
  };

  static getAccessTokenFromHeader(req) {
    const authHeader = req.headers["authorization"];

    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.split(" ")[1];
    } else {
      return null;
    }
  }
}
export class Employee_AuthService {
  static signIn = async (loginData) => {
    const { identifier, password } = loginData;
    const user = await employeeAccountService.findEmployeeByIdentifier(identifier);
    if (!user) {
      throw customError("Không tìm thấy người dùng", 400);
    }
    const isMatch = Employee_AuthService.checkPassword(password, user.Password);
    if (!isMatch) {
      throw customError("Mật khẩu không đúng", 400);
    }
    let payload = {
      id: user.MaTKNV,
      name: user.TenNV,
      email: user.Email,
      phone: user.SDT,
      birth: user.NTNS,
    };
    let tokens = JwtService.createJWT(payload);
    const roles = await roleService.getAllPermissionOfEmployeeFunction(user.MaTKNV);
    return {
      id: user.MaTKNV,
      name: user.TenNV,
      email: user.Email,
      phone: user.SDT,
      birth: user.NTNS,
      roles,
      tokens,
    };
  };

  static processNewToken = async (refreshToken) => {
    const decoded = JwtService.verifyRTToken(refreshToken);

    if (!decoded) {
      throw customError("Invalid or expired refresh token", 403);
    }
    const payload = {
      id: user.MaTKNV,
      name: user.TenNV,
      email: user.Email,
      phone: user.SDT,
      birth: user.NTNS,
    };

    const newTokens = JwtService.createJWT(payload);

    return {
      id: user.MaTKNV,
      name: user.TenNV,
      email: user.Email,
      phone: user.SDT,
      birth: user.NTNS,
      tokens: newTokens,
    };
  };

  static checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword); // true
  };

  static fetchAccount = async (req) => {
    const accessToken = this.getAccessTokenFromHeader(req);
    if (!accessToken) throw customError("Invalid or expired access token", 401);

    const decoded = JwtService.verifyATToken(accessToken);

    if (!decoded) {
      throw customError("Invalid or expired access token", 401);
    }

    const user = await EmployeeAccount.findById(decoded.id);

    const payload = {
      id: user.MaTKNV,
      name: user.TenNV,
      email: user.Email,
      phone: user.SDT,
      birth: user.NTNS,
    };

    return {
      ...payload,
    };
  };

  static getAccessTokenFromHeader(req) {
    const authHeader = req.headers["authorization"];

    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.split(" ")[1];
    } else {
      return null;
    }
  }
}