import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Override local DNS resolver programmatically to prevent querySrv ECONNREFUSED issues in restricted local setups.
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("⚠️ Public DNS servers could not be set programmatically:", e.message);
}

/**
 * Connects to MongoDB Atlas using Mongoose.
 * Logs success containing connection host, or exits the process on failure.
 */
export const connectDB = async () => {
  try {
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

    const conn = await mongoose.connect(process.env.MONGODB_URI, sanitizedOptions);

    // On success: log "MongoDB Atlas Connected: <host>"
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    // On error: log the error and call process.exit(1)
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;