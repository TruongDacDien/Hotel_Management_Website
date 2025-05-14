import expressAsyncHandler from "express-async-handler";
import JwtService from "../auth/jwt/jwtService.js";
import { customError } from "./errorHandlers.js";

const validateToken = (model) => expressAsyncHandler(async function (req, res, next) {
  let authHeader = req?.headers?.authorization;
  if (!authHeader) {
    throw customError("There is no token inside request!", 401);
  }
  if (authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = JwtService.verifyATToken(token)
      const user = await model.findById(decoded?.id);
      if (!user) {
        throw customError("User not found!", 404);
      }
      req.user = user;
      next();
    } catch (error) {
      throw customError(error.message || "Token validation failed", 403);
    }
  } else {
    throw new Error("There is no token inside request!");
  }
});

const checkIsAdmin = expressAsyncHandler(async (req, res, next) => {
  const user = req.user;
  if (user.MaTKNV === 1) {
    next();
  } else {
    throw customError("You are not permitted!", 403);
  }
});

export { validateToken, checkIsAdmin };