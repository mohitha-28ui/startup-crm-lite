import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from the backend directory regardless of cwd
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

// Override local DNS resolver programmatically to prevent querySrv ECONNREFUSED issues in restricted local setups.
try {
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
  }
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("⚠️ Public DNS servers could not be set programmatically:", e.message);
}

let mongodInstance = null;

/**
 * Connects to MongoDB Atlas using Mongoose with automatic in-memory fallback.
 * Logs success containing connection host, or exits the process on failure.
 */
export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  // Mongoose options required by the specification
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Sanitize options for Mongoose 6+ and Mongoose 9.x to avoid unsupported options MongoParseError
  const sanitizedOptions = { ...options };
  const mongooseMajor = parseInt(mongoose.version || "9", 10);
  if (mongooseMajor >= 6) {
    delete sanitizedOptions.useNewUrlParser;
    delete sanitizedOptions.useUnifiedTopology;
  }

  const uri = process.env.MONGODB_URI;

  // Try Atlas/configured URI first
  if (uri && process.env.USE_IN_MEMORY_DB !== "true") {
    try {
      const conn = await mongoose.connect(uri, {
        ...sanitizedOptions,
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn("⚠️ Could not connect to remote MongoDB Atlas:", error.message);
      console.log("⚡ Starting local in-memory MongoDB fallback...");
    }
  }

  // Fallback to in-memory MongoDB server
  try {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memoryUri, sanitizedOptions);
    console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host} (${memoryUri})`);
  } catch (fallbackError) {
    console.error("❌ Failed to initialize database:", fallbackError);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw fallbackError;
  }
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