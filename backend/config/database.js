import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from backend directory if present
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

// Prefer IPv4 in DNS lookups if supported
try {
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch (e) {
  // Ignore DNS config warnings in restrictive environments
}

let mongodInstance = null;

/**
 * Connects to MongoDB Atlas using Mongoose.
 * Uses persistent cloud database in production with optional local fallback.
 */
export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  // In production, require persistent cloud database
  if (process.env.NODE_ENV === "production" && !uri) {
    console.error("❌ FATAL: MONGODB_URI environment variable is missing in production.");
    throw new Error("MONGODB_URI is required in production mode.");
  }

  // Connect to persistent MongoDB (Atlas or local instance)
  if (uri && process.env.USE_IN_MEMORY_DB !== "true") {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`❌ MongoDB connection error: ${error.message}`);
      if (process.env.NODE_ENV === "production") {
        throw error;
      }
      console.warn("⚠️ Remote MongoDB connection failed. Attempting local development fallback...");
    }
  }

  // Fallback to in-memory MongoDB when explicitly requested or during local development
  const allowInMemory = process.env.USE_IN_MEMORY_DB === "true" || process.env.NODE_ENV !== "production";
  if (allowInMemory) {
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host} (${memoryUri})`);
      return;
    } catch (fallbackError) {
      console.warn("ℹ️ In-memory MongoDB not available in this environment:", fallbackError.message);
    }
  }

  throw new Error("Could not establish a database connection. Please check MONGODB_URI.");
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongodInstance) {
      await mongodInstance.stop();
      mongodInstance = null;
    }
  } catch (err) {
    console.error("Error closing database connection:", err);
  }
};

export default connectDB;