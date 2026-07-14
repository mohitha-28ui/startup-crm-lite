import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Lead Schema definition for Mongoose.
 * Declares all attributes, validation rules, indexing specifications, and virtual getters.
 */
export const leadSchema = new Schema(
  {
    /**
     * The name of the primary contact person for the lead.
     * Must be a string between 2 and 100 characters, trimmed.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, "Contact name is required"],
      trim: true,
      minlength: [2, "Contact name must be at least 2 characters"],
      maxlength: [100, "Contact name cannot exceed 100 characters"],
    },
    /**
     * The name of the company associated with this opportunity.
     * Required and trimmed.
     * @type {String}
     */
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    /**
     * The lead's primary email address.
     * Required, trimmed, and strictly validated.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Email must be a valid email address",
      },
    },
    /**
     * Contact telephone number for the lead.
     * Optional and trimmed.
     * @type {String}
     */
    phone: {
      type: String,
      trim: true,
    },
    /**
     * The current pipeline status stage of the lead.
     * Must match exactly one of the designated status options from the frontend.
     * Defaults to 'New'.
     * @type {String}
     */
    status: {
      type: String,
      enum: {
        values: [
          "New",
          "Contacted",
          "Meeting Scheduled",
          "Proposal Sent",
          "Won",
          "Lost",
        ],
        message: "Status must be: New, Contacted, Meeting Scheduled, Proposal Sent, Won, or Lost",
      },
      default: "New",
    },
    /**
     * The marketing acquisition channel source of the lead.
     * Must match exactly one of the source options from the frontend.
     * Defaults to 'Website'.
     * @type {String}
     */
    source: {
      type: String,
      enum: {
        values: [
          "Website",
          "Referral",
          "LinkedIn",
          "Cold Call",
          "Email Campaign",
          "Other",
        ],
        message: "Source must be: Website, Referral, LinkedIn, Cold Call, Email Campaign, or Other",
      },
      default: "Website",
    },
    /**
     * Summary notes or deal descriptions relating to the lead.
     * Optional, maximum length of 1000 characters.
     * @type {String}
     */
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    /**
     * The Mongoose User ID representing the owner/creator of the lead record.
     * Required reference to the User model.
     * @type {mongoose.Schema.Types.ObjectId}
     */
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner user reference is required"],
    },
  },
  {
    timestamps: true,
    // Enable virtual fields to be included in JSON and Object outputs
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Database Indexes configuration
// 1. Compound index on (owner, status) for optimized routing and stage filter queries
leadSchema.index({ owner: 1, status: 1 });

// 2. Index on email for rapid search, duplicate checks, and lookups
leadSchema.index({ email: 1 });

// 3. Compound index on (owner, createdAt) for sorting, pagination, and date range filters
leadSchema.index({ owner: 1, createdAt: -1 });

// 4. Compound indexes for rapid searches under owner isolation
leadSchema.index({ owner: 1, name: 1 });
leadSchema.index({ owner: 1, company: 1 });
leadSchema.index({ owner: 1, email: 1 });

// 5. Compound index for filtering leads by acquisition source under owner isolation
leadSchema.index({ owner: 1, source: 1 });

/**
 * Virtual getter representing the number of days elapsed since the lead was created.
 * Useful for pipeline age analytics.
 * @name age
 * @type {Number}
 */
leadSchema.virtual("age").get(function () {
  if (!this.createdAt) {
    return 0;
  }
  const diffTime = Date.now() - this.createdAt.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : 0;
});

/**
 * Lead Mongoose Model.
 * Represents the leads collection in the database.
 */
export const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
