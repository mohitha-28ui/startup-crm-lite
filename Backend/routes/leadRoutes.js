import express from "express";
import { body } from "express-validator";

// Controller imports
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeads,
} from "../controllers/leadController.js";

// Middleware imports
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// Apply protect middleware to ALL routes in this file
router.use(protect);

/**
 * Validation rules for creating a lead.
 * Requires name (minLength 2), company (not empty), and email (valid format).
 * Optional status and source enums are validated against their allowed list.
 */
const createLeadValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Contact name is required")
    .isLength({ min: 2 })
    .withMessage("Contact name must be at least 2 characters long"),
  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("status")
    .optional()
    .isIn(["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"])
    .withMessage("Status must be: New, Contacted, Meeting Scheduled, Proposal Sent, Won, or Lost"),
  body("source")
    .optional()
    .isIn(["Website", "Referral", "LinkedIn", "Cold Call", "Email Campaign", "Other"])
    .withMessage("Source must be: Website, Referral, LinkedIn, Cold Call, Email Campaign, or Other"),
];

/**
 * Validation rules for updating a lead.
 * Makes fields optional, but if provided, validates them against constraints.
 */
const updateLeadValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Contact name must be at least 2 characters long"),
  body("company")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Company name cannot be empty"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("status")
    .optional()
    .isIn(["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"])
    .withMessage("Status must be: New, Contacted, Meeting Scheduled, Proposal Sent, Won, or Lost"),
  body("source")
    .optional()
    .isIn(["Website", "Referral", "LinkedIn", "Cold Call", "Email Campaign", "Other"])
    .withMessage("Source must be: Website, Referral, LinkedIn, Cold Call, Email Campaign, or Other"),
];

/**
 * Validation rules for updating status only.
 */
const updateStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"])
    .withMessage("Status must be: New, Contacted, Meeting Scheduled, Proposal Sent, Won, or Lost"),
];

// 1. GET /api/leads/search -> Autocomplete search leads (Registered BEFORE dynamic /:id to prevent routing issues)
router.get("/search", searchLeads);

// 2. GET /api/leads/stats/summary -> Retrieve aggregated dashboard metrics
router.get("/stats/summary", getLeadStats);

// 3. GET /api/leads/stats/monthly -> Retrieve monthly timeline leads count
router.get("/stats/monthly", getMonthlyStats);

// 4. GET /api/leads/stats -> Retrieve aggregated dashboard metrics (Registered BEFORE dynamic /:id to prevent matching issues)
router.get("/stats", getLeadStats);

// 5. GET /api/leads/analytics -> Retrieve monthly timeline leads count (Registered BEFORE dynamic /:id)
router.get("/analytics", getMonthlyStats);

// 3. GET /api/leads/ -> Get all leads (with search, pagination, filtering, sorting)
router.get("/", getLeads);

// 4. POST /api/leads/ -> Create a new lead
router.post("/", validate(createLeadValidation), createLead);

// 5. GET /api/leads/:id -> Retrieve a specific lead by ID
router.get("/:id", getLeadById);

// 6. PUT /api/leads/:id -> Update an entire lead's details
router.put("/:id", validate(updateLeadValidation), updateLead);

// 7. PATCH /api/leads/:id/status -> Update a lead's pipeline status stage
router.patch("/:id/status", validate(updateStatusValidation), updateLeadStatus);

// 8. DELETE /api/leads/:id -> Delete a lead record
router.delete("/:id", deleteLead);

export default router;
