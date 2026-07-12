import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { errorResponse } from "../utils/apiResponse.js";

/**
 * Middleware to protect routes by verifying JWT tokens.
 * Extracts, decodes, and checks token expiration and user existence.
 * Attaches the authenticated user (minus password) to `req.user`.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extract token from Authorization header: 'Bearer <token>'
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If token is missing
    if (!token) {
      return errorResponse(res, "No token provided, access denied", 401);
    }

    let decoded;
    try {
      // 2. Verify token with jwt.verify
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // If token expired
      if (err.name === "TokenExpiredError") {
        return errorResponse(res, "Token has expired, please login again", 401);
      }
      // If token invalid for any other reason
      return errorResponse(res, "Token is invalid", 401);
    }

    // 3. Find the user in the database, excluding the password field
    const user = await User.findById(decoded.id).select("-password");

    // If user no longer exists
    if (!user) {
      return errorResponse(
        res,
        "User belonging to this token no longer exists",
        401
      );
    }

    // 4. Attach user to req.user and call next middleware
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default protect;
