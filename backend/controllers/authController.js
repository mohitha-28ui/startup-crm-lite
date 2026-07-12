import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

/**
 * PRODUCTION SECURITY NOTE:
 * In a production environment, you should mount 'express-rate-limit' on authentication endpoints
 * (such as POST /api/auth/login and POST /api/auth/register) to mitigate brute-force
 * and denial-of-service (DoS) attacks.
 *
 * Example implementation:
 * import rateLimit from "express-rate-limit";
 * const authLimiter = rateLimit({
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 *   max: 5, // Limit each IP to 5 requests per windowMs for authentication routes
 *   message: "Too many login attempts, please try again after 15 minutes",
 * });
 * router.post("/login", authLimiter, ...);
 */

/**
 * Helper function to generate a JWT token.
 * 
 * @param {String} userId - The Mongoose document ID of the User.
 * @returns {String} Signed JWT.
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Registers a new user in the system.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "Email already exists", 409);
    }

    // 2. Create new User document (password is hashed in pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
    });

    // 3. Generate JWT
    const token = generateToken(user._id);

    // 4. Return 201 with token and user (toJSON excludes password)
    const userObject = user.toObject();
    delete userObject.password;

    return successResponse(
      res,
      { token, user: userObject },
      "User registered successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticates a user and returns a signed JWT.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email, explicitly requesting the password field (due to select: false in schema)
    const user = await User.findOne({ email }).select("+password");

    // 2. If user is not found or password does not match
    if (!user || !(await user.comparePassword(password))) {
      // Security practice: do not reveal whether the email or password is incorrect
      return errorResponse(res, "Invalid credentials", 401);
    }

    // 3. If user.isActive is false: 403 "Account is deactivated"
    if (!user.isActive) {
      return errorResponse(res, "Account is deactivated", 403);
    }

    // 4. Generate JWT
    const token = generateToken(user._id);

    // 5. Return 200 with token and user (password is stripped)
    const userObject = user.toObject();
    delete userObject.password;

    return successResponse(
      res,
      { token, user: userObject },
      "Login successful",
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves the current authenticated user's profile.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user is already attached by the protect middleware (without password)
    return successResponse(
      res,
      { user: req.user },
      "Profile retrieved successfully",
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the current authenticated user's profile (name and/or password).
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, oldPassword, newPassword } = req.body;

    // Find the user by ID and select password to perform credential checks if changing password
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Allow updating name only (email changes require verification flows)
    if (name) {
      user.name = name;
    }

    // If new password is provided, validate the old one first
    if (newPassword) {
      if (!oldPassword) {
        return errorResponse(
          res,
          "Old password is required to set a new password",
          400
        );
      }

      // Check if old password matches
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return errorResponse(res, "Invalid old password", 400);
      }

      // Update password (pre-save hook will hash this new password)
      user.password = newPassword;
    }

    // Save changes
    await user.save();

    // Return the updated user without the password field
    const updatedUser = user.toObject();
    delete updatedUser.password;

    return successResponse(
      res,
      { user: updatedUser },
      "Profile updated successfully",
      200
    );
  } catch (error) {
    next(error);
  }
};