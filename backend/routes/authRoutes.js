import express from "express";
import { body } from "express-validator";

// Controller imports
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";

// Middleware imports
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

/**
 * Validation rules for user registration.
 */
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

/**
 * Validation rules for user login.
 */
const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * 1. Public Route: Register new user
 * POST /api/auth/register
 */
router.post("/register", validate(registerValidation), register);

/**
 * 2. Public Route: Login user
 * POST /api/auth/login
 */
router.post("/login", validate(loginValidation), login);

/**
 * 3. Protected Route: Get current user profile
 * GET /api/auth/profile
 */
router.get("/profile", protect, getProfile);

/**
 * 4. Protected Route: Update user profile details
 * PUT /api/auth/profile
 */
router.put("/profile", protect, updateProfile);

/**
 * 5. Public Route: Authentication system status health check
 * GET /api/auth/status
 */
router.get("/status", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication system is active and operational",
  });
});

export default router;
