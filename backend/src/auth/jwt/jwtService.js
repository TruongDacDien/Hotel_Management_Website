import jwt from "jsonwebtoken";
import { customError } from "../../middlewares/errorHandlers.js";

export default class JwtService {
    static createJWT = (payload) => {
        try {
            let accessToken = jwt.sign(payload, process.env.JWT_AT_SECRET, {
                expiresIn: process.env.JWT_AT_EXPIRESIN,
            });
            let refreshToken = jwt.sign(payload, process.env.JWT_RT_SECRET, {
                expiresIn: process.env.JWT_RT_EXPIRESIN,
            });
            return {
                accessToken,
                refreshToken
            };
        } catch (e) { }
        return null
    };

    static verifyATToken = (token) => {
        let key = process.env.JWT_AT_SECRET;
        let decoded = null;
        try {
            decoded = jwt.verify(token, key);
        } catch (e) {
            throw customError("Unauthoried", 401)
        }
        return decoded;
    };

    static verifyRTToken = (token) => {
        let key = process.env.JWT_RT_SECRET;
        let decoded = null;
        try {
            decoded = jwt.verify(token, key);
        } catch (e) {
            throw customError("Unauthoried", 401)
        }
        return decoded;
    };

}