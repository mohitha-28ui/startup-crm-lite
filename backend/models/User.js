import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

/**
 * User Schema definition for Mongoose.
 * Declares all attributes, validation parameters, and database constraints.
 */
export const userSchema = new Schema(
  {
    /**
     * The user's full name.
     * Must be a string between 2 and 50 characters, trimmed.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    /**
     * The user's unique email address.
     * Must be unique, lowercase, trimmed, and strictly conform to email patterns.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Email must be a valid email address",
      },
    },
    /**
     * The user's hashed password credentials.
     * Must be at least 6 characters before hashing.
     * @type {String}
     */
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    /**
     * The role assigned to the user for role-based authorization.
     * Must be either 'admin' or 'user'.
     * Defaults to 'user'.
     * @type {String}
     */
    role: {
      type: String,
      enum: {
        values: ["admin", "user"],
        message: "Role must be either 'admin' or 'user'",
      },
      default: "user",
    },
    /**
     * Indicates whether the user account is active.
     * Accounts marked inactive cannot authenticate.
     * Defaults to true.
     * @type {Boolean}
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to securely hash passwords prior to save operations
userSchema.pre("save", async function () {
  // Hash the password only if it has been modified or is new
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compares a plain text candidate password with the user's hashed password.
 * @param {String} candidatePassword - The plain text password to check.
 * @returns {Promise<Boolean>} Resolves to true if password matches, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Override default toJSON behavior to exclude password properties from serialization
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

/**
 * User Mongoose Model.
 * Represents the users collection in the database.
 */
export const User = mongoose.model("User", userSchema);

export default User;
