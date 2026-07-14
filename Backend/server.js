import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

// Database Configuration
import { connectDB } from "./config/database.js";

// Routes Imports
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";

// Global Middleware Error Handler
import { errorHandler } from "./middleware/errorHandler.js";

// Load Environment Variables
dotenv.config();

// Resolve paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express App
const app = express();

// Trust proxy (required when deployed behind load balancers/reverse proxies like Railway, Heroku, Vercel)
app.set("trust proxy", 1);

/**
 * Environment Variables Validation
 */
const checkRequiredEnvVars = () => {
  const required = ["MONGODB_URI", "JWT_SECRET", "PORT"];
  const missing = required.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    console.error("Missing environment variables:");
    missing.forEach((v) => console.error(`- ${v}`));
    process.exit(1);
  }
};

/**
 * Mongo Sanitize
 */
const cleanObj = (obj) => {
  if (!obj || typeof obj !== "object") return;

  for (const key in obj) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      cleanObj(obj[key]);
    }
  }
};

const mongoSanitizeMiddleware = (req, res, next) => {
  cleanObj(req.body);
  cleanObj(req.query);
  cleanObj(req.params);
  next();
};

/**
 * Security
 */
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(mongoSanitizeMiddleware);

/**
 * Rate Limit
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, // Safe limit for general usage
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Generous limit for authentication during testing
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth", authLimiter);
app.use("/api", generalLimiter);

/**
 * Logging
 */
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

/**
 * ✅ CORS FIX
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/**
 * Body Parser
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Health Route
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
  });
});

/**
 * API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

/**
 * Root Route
 */
app.get("/", (req, res) => {
  res.redirect(
    "https://startup-crm-lite-m7xxxg18e-sanamohitha82-4638s-projects.vercel.app"
  );
});

/**
 * Error Handler
 */
app.use(errorHandler);

/**
 * Graceful Shutdown
 */
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}`);

  try {
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

/**
 * Start Server
 */
const startServer = async () => {
  checkRequiredEnvVars();

  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT} in ${process.env.NODE_ENV || "development"
      } mode`
    );
  });
};

startServer();

export default app;