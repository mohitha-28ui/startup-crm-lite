import Lead from "../models/Lead.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";

/**
 * 1. Retrieve all leads belonging to the authenticated user.
 * Supports status, source, and date range filtering, full-text regex searching across name/company/email,
 * sorting, and pagination.
 *
 * Inputs:
 * - req.query.status {String} (optional) stage filter value (e.g. 'Won', 'New') or 'All'.
 * - req.query.search {String} (optional) contact name, company name, or email search term.
 * - req.query.source {String} (optional) marketing channel filter value or 'All'.
 * - req.query.dateFrom {String} (optional) ISO date string for creation date range start.
 * - req.query.dateTo {String} (optional) ISO date string for creation date range end.
 * - req.query.page {Number} page index (defaults to 1).
 * - req.query.limit {Number} page size (defaults to 20).
 * - req.query.sortBy {String} sort field name (defaults to 'createdAt').
 * - req.query.sortOrder {String} sort order ('asc' or 'desc', defaults to 'desc').
 *
 * Outputs:
 * - Standardized paginated response with lead items and pagination metadata:
 *   { total, page, limit, pages, hasNext, hasPrev }
 *
 * Side Effects:
 * - Performs read queries on the Leads MongoDB collection.
 */
export const getLeads = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
      console.log(`[getLeads] Fetching leads for User ID: ${req.user._id}`);
    }

    const {
      status,
      search,
      source,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skipVal = (pageNum - 1) * limitNum;

    // Build the query filters dynamically (always scoped to the authenticated owner for isolation)
    const filter = { owner: req.user._id };

    if (status && status !== "All") {
      filter.status = status;
    }

    if (source && source !== "All") {
      filter.source = source;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    // Configure sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Run query and document count operations in parallel
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sortOptions)
        .skip(skipVal)
        .limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    return paginatedResponse(res, leads, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

/**
 * 2. Create a new lead record.
 * Scopes the created lead to the currently authenticated user's ID as the owner.
 *
 * Inputs:
 * - req.body {Object} containing lead attributes (name, company, email, phone, status, source, notes).
 *
 * Outputs:
 * - Standardized response with the created Lead document (HTTP 201).
 *
 * Side Effects:
 * - Inserts a new lead record into the MongoDB database.
 */
export const createLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
      console.log(`[createLead] User ${req.user._id} is creating a new lead for contact: ${req.body.name}`);
    }

    const { name, company, email, phone, status, source, notes } = req.body;

    const lead = await Lead.create({
      name,
      company,
      email,
      phone,
      status,
      source,
      notes,
      owner: req.user._id, // Enforce owner isolation
    });

    return successResponse(res, lead, "Lead created successfully", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * 3. Retrieve a specific lead record by its ID.
 * Enforces ownership constraint.
 *
 * Inputs:
 * - req.params.id {String} Mongoose ObjectId of the lead.
 *
 * Outputs:
 * - Standardized success response with the matched Lead document, or 404 error if not found.
 *
 * Side Effects:
 * - Reads a single Lead record from MongoDB.
 */
export const getLeadById = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
      console.log(`[getLeadById] Fetching Lead ID: ${req.params.id} for User ID: ${req.user._id}`);
    }

    const lead = await Lead.findOne({
      _id: req.params.id,
      owner: req.user._id, // Enforce owner isolation
    });

    if (!lead) {
      return errorResponse(res, "Lead not found", 404);
    }

    return successResponse(res, lead, "Lead retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * 4. Update an existing lead record's details.
 * Ensures the target lead exists and belongs to the authenticated user.
 * Restricts updates to the owner field.
 *
 * Inputs:
 * - req.params.id {String} Mongoose ObjectId of the lead.
 * - req.body {Object} containing parameters to modify.
 *
 * Outputs:
 * - Standardized success response with the updated Lead document.
 *
 * Side Effects:
 * - Mutates and saves a Lead record in MongoDB.
 */
export const updateLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
      console.log(`[updateLead] User ${req.user._id} updating Lead ID: ${req.params.id}`);
    }

    // Do NOT allow changing the owner field
    if (req.body.owner) {
      delete req.body.owner;
    }

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, // Enforce owner isolation
      req.body,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, "Lead not found", 404);
    }

    return successResponse(res, lead, "Lead updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * 5. Update only the status stage of a lead.
 * Optimizes the pipeline status update action.
 *
 * Inputs:
 * - req.params.id {String} Mongoose ObjectId of the lead.
 * - req.body.status {String} the new status enum value.
 *
 * Outputs:
 * - Standardized success response with the updated Lead document.
 *
 * Side Effects:
 * - Updates the status property of a Lead document in MongoDB.
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
      console.log(`[updateLeadStatus] Updating status of Lead ID: ${req.params.id} to '${req.body.status}'`);
    }

    const { status } = req.body;

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, // Enforce owner isolation
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, "Lead not found", 404);
    }

    return successResponse(res, lead, "Lead status updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * 6. Delete a lead record.
 * Ensures the target lead exists and belongs to the authenticated user.
 *
 * Inputs:
 * - req.params.id {String} Mongoose ObjectId of the lead to delete.
 *
 * Outputs:
 * - Standardized success response message.
 *
 * Side Effects:
 * - Deletes a Lead record from MongoDB.
 */
export const deleteLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
      console.log(`[deleteLead] User ${req.user._id} deleting Lead ID: ${req.params.id}`);
    }

    const lead = await Lead.findOne({
      _id: req.params.id,
      owner: req.user._id, // Enforce owner isolation
    });

    if (!lead) {
      return errorResponse(res, "Lead not found", 404);
    }

    await lead.deleteOne();

    return successResponse(res, null, "Lead deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * 7. Retrieve aggregated lead metrics.
 * Calculates total, status breakdowns, source breakdowns, conversion rate,
 * this month vs last month lead counts, and growth rate in a single aggregation query.
 *
 * Inputs:
 * - req.user._id {String} Authenticated user ID.
 *
 * Outputs:
 * - Object: {
 *     totalLeads,
 *     statusBreakdown: { New, Contacted, ... },
 *     conversionRate,
 *     sourceBreakdown: { Website, ... },
 *     thisMonthLeads,
 *     lastMonthLeads,
 *     growthRate
 *   }
 *
 * Side Effects:
 * - Performs a single aggregation query on the MongoDB Leads collection.
 */
export const getLeadStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
      console.log(`[getLeadStats] Compiling aggregation stats for User ID: ${req.user._id}`);
    }

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const statsResult = await Lead.aggregate([
      {
        $match: { owner: req.user._id }, // Enforce owner isolation
      },
      {
        $facet: {
          overall: [
            {
              $group: {
                _id: null,
                totalLeads: { $sum: 1 },
                wonLeads: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "Won"] }, 1, 0],
                  },
                },
                lostLeads: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "Lost"] }, 1, 0],
                  },
                },
                thisMonthLeads: {
                  $sum: {
                    $cond: [{ $gte: ["$createdAt", startOfThisMonth] }, 1, 0],
                  },
                },
                lastMonthLeads: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gte: ["$createdAt", startOfLastMonth] },
                          { $lt: ["$createdAt", startOfThisMonth] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
          byStatus: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          bySource: [
            {
              $group: {
                _id: "$source",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const facetData = statsResult[0] || { overall: [], byStatus: [], bySource: [] };
    const overall = facetData.overall[0] || {
      totalLeads: 0,
      wonLeads: 0,
      lostLeads: 0,
      thisMonthLeads: 0,
      lastMonthLeads: 0,
    };

    const totalLeads = overall.totalLeads;
    const wonLeads = overall.wonLeads;
    const lostLeads = overall.lostLeads;
    const thisMonthLeads = overall.thisMonthLeads;
    const lastMonthLeads = overall.lastMonthLeads;

    // Handle conversionRate edge case (division by zero when totalLeads is 0)
    const conversionRate =
      totalLeads > 0 ? parseFloat(((wonLeads / totalLeads) * 100).toFixed(1)) : 0.0;

    // Handle growthRate division by zero when lastMonthLeads is 0
    const growthRate =
      lastMonthLeads > 0
        ? parseFloat((((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100).toFixed(1))
        : (thisMonthLeads > 0 ? 100.0 : 0.0);

    // Initialize breakdowns with 0 for all enums to prevent missing fields in response
    const statusBreakdown = {
      New: 0,
      Contacted: 0,
      "Meeting Scheduled": 0,
      "Proposal Sent": 0,
      Won: 0,
      Lost: 0,
    };

    const sourceBreakdown = {
      Website: 0,
      Referral: 0,
      LinkedIn: 0,
      "Cold Call": 0,
      "Email Campaign": 0,
      Other: 0,
    };

    facetData.byStatus.forEach((item) => {
      if (item._id && statusBreakdown[item._id] !== undefined) {
        statusBreakdown[item._id] = item.count;
      }
    });

    facetData.bySource.forEach((item) => {
      if (item._id && sourceBreakdown[item._id] !== undefined) {
        sourceBreakdown[item._id] = item.count;
      }
    });

    return successResponse(
      res,
      {
        totalLeads,
        wonLeads,
        lostLeads,
        statusBreakdown,
        conversionRate,
        sourceBreakdown,
        thisMonthLeads,
        lastMonthLeads,
        growthRate,
      },
      "Lead statistics compiled successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * 8. Retrieve monthly timeline leads stats.
 * Groups leads created in the last 6 months by year+month, counting totals, wins, and losses.
 * Pre-fills months with zero entries to guarantee consistency on the charts.
 *
 * Inputs:
 * - req.user._id {String} Authenticated user ID reference.
 *
 * Outputs:
 * - Array: [{ month: 'MMM YYYY', total, won, lost, conversionRate }, ...] sorted chronologically.
 *
 * Side Effects:
 * - Performs aggregation pipelines on MongoDB.
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
      console.log(`[getMonthlyStats] Generating 6-month timeline for User ID: ${req.user._id}`);
    }

    const now = new Date();
    // Determine target range: start of the month 5 months ago
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1, 0, 0, 0, 0);

    const stats = await Lead.aggregate([
      {
        $match: {
          owner: req.user._id, // Enforce owner isolation
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
          won: {
            $sum: {
              $cond: [{ $eq: ["$status", "Won"] }, 1, 0],
            },
          },
          lost: {
            $sum: {
              $cond: [{ $eq: ["$status", "Lost"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Build chronological month map
    const resultsMap = new Map();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1; // 1-indexed to match MongoDB $month numbers
      const monthLabel = `${monthNames[d.getMonth()]} ${year}`;
      const key = `${year}-${monthNum}`;
      resultsMap.set(key, { month: monthLabel, total: 0, won: 0, lost: 0, conversionRate: 0.0 });
    }

    // Populate data from DB query
    stats.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      if (resultsMap.has(key)) {
        const existing = resultsMap.get(key);
        existing.total = item.total;
        existing.won = item.won;
        existing.lost = item.lost;
        existing.conversionRate =
          item.total > 0 ? parseFloat(((item.won / item.total) * 100).toFixed(1)) : 0.0;
      }
    });

    const monthlyStatsArray = Array.from(resultsMap.values());

    return successResponse(
      res,
      monthlyStatsArray,
      "Monthly leads timeline statistics compiled successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * 9. Quick search for autocomplete (React SearchBar debounce).
 * Returns only: _id, name, company, email, status.
 * Limits results to 5 by default for performance.
 *
 * Inputs:
 * - req.query.q {String} search term.
 * - req.query.limit {Number} limit on output array length (defaults to 5).
 *
 * Outputs:
 * - Array of matched Lead documents: [{ _id, name, company, email, status }, ...].
 *
 * Side Effects:
 * - Performs read query on Leads collection.
 */
export const searchLeads = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;
    const limitNum = parseInt(limit, 10) || 5;

    if (!q) {
      return successResponse(res, [], "Search query is empty");
    }

    const searchRegex = new RegExp(q, "i");
    const filter = {
      owner: req.user._id, // Enforce owner isolation
      $or: [
        { name: searchRegex },
        { company: searchRegex },
        { email: searchRegex },
      ],
    };

    const leads = await Lead.find(filter)
      .select("_id name company email status")
      .limit(limitNum);

    return successResponse(res, leads, "Autocomplete leads search successful");
  } catch (error) {
    next(error);
  }
};