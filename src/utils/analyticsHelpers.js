/**
 * Safe parser to convert string/numeric values into float values.
 * e.g., "$12,500" -> 12500, "₹4,80,000" -> 480000
 *
 * @param {string|number} value - Value to parse.
 * @returns {number} Float representation or 0 if invalid.
 */
export function parseDealValue(value) {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const normalized = String(value).replace(/[^0-9.-]+/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Normalizes lead date. Supports ISO strings or plain date strings.
 *
 * @param {Object} lead - The lead record.
 * @returns {Date} Date object.
 */
export function parseLeadDate(lead) {
  const dateStr = lead.createdAt || lead.dateAdded;
  if (!dateStr) return new Date();
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Calculates lead status distribution.
 *
 * @param {Array<Object>} leads - Array of leads.
 * @returns {Array<Object>} Status distribution list with percentages.
 */
export function getStatusDistribution(leads = []) {
  const total = leads.length;
  const counts = { New: 0, Contacted: 0, Meeting: 0, Proposal: 0, Won: 0, Lost: 0 };

  leads.forEach((lead) => {
    const status = lead.status;
    if (status === "New") counts.New += 1;
    else if (status === "Contacted") counts.Contacted += 1;
    else if (status === "Meeting Scheduled" || status === "Meeting") counts.Meeting += 1;
    else if (status === "Proposal Sent" || status === "Proposal") counts.Proposal += 1;
    else if (status === "Won") counts.Won += 1;
    else if (status === "Lost") counts.Lost += 1;
  });

  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
    percentage: total > 0 ? Math.round((value / total) * 100) : 0,
  }));
}

/**
 * Generates monthly lead counts for the last 6 months.
 *
 * @param {Array<Object>} leads - Array of leads.
 * @returns {Array<Object>} List of monthly lead stats.
 */
export function getMonthlyLeads(leads = []) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const last6Months = [];
  const now = new Date();

  // Initialize the last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mName = months[d.getMonth()];
    const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    last6Months.push({ key: mKey, month: mName, count: 0 });
  }

  leads.forEach((lead) => {
    const date = parseLeadDate(lead);
    const mKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const found = last6Months.find((item) => item.key === mKey);
    if (found) {
      found.count += 1;
    }
  });

  return last6Months.map(({ month, count }) => ({ month, count }));
}

/**
 * Calculates monthly win conversion rate (Won / Total) for the last 6 months.
 *
 * @param {Array<Object>} leads - Array of leads.
 * @returns {Array<Object>} Monthly conversion rate stats.
 */
export function getConversionByMonth(leads = []) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const last6Months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mName = months[d.getMonth()];
    const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    last6Months.push({ key: mKey, month: mName, total: 0, won: 0 });
  }

  leads.forEach((lead) => {
    const date = parseLeadDate(lead);
    const mKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const found = last6Months.find((item) => item.key === mKey);
    if (found) {
      found.total += 1;
      if (lead.status === "Won") {
        found.won += 1;
      }
    }
  });

  return last6Months.map(({ month, total, won }) => ({
    month,
    rate: total > 0 ? Math.round((won / total) * 100) : 0,
  }));
}

/**
 * Calculates monthly revenue (sum of Won lead values) for the last 6 months.
 *
 * @param {Array<Object>} leads - Array of leads.
 * @returns {Array<Object>} Monthly won revenue stats.
 */
export function getRevenueByMonth(leads = []) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const last6Months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mName = months[d.getMonth()];
    const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    last6Months.push({ key: mKey, month: mName, revenue: 0 });
  }

  leads.forEach((lead) => {
    if (lead.status !== "Won") return;
    const date = parseLeadDate(lead);
    const mKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const found = last6Months.find((item) => item.key === mKey);
    if (found) {
      found.revenue += parseDealValue(lead.value);
    }
  });

  return last6Months.map(({ month, revenue }) => ({ month, revenue }));
}

/**
 * Sums up active lead values (excludes Won/Lost).
 *
 * @param {Array<Object>} leads - Array of leads.
 * @returns {number} Pipeline value.
 */
export function getPipelineValue(leads = []) {
  return leads
    .filter((lead) => !["Won", "Lost"].includes(lead.status))
    .reduce((sum, lead) => sum + parseDealValue(lead.value), 0);
}

/**
 * Sums up closed Won lead values.
 *
 * @param {Array<Object>} leads - Array of leads.
 * @returns {number} Won revenue value.
 */
export function getWonRevenue(leads = []) {
  return leads
    .filter((lead) => lead.status === "Won")
    .reduce((sum, lead) => sum + parseDealValue(lead.value), 0);
}

/**
 * Computes the average sales cycle in days for Won leads.
 *
 * @param {Array<Object>} leads - Array of leads.
 * @returns {number} Average days.
 */
export function getAverageSalesCycle(leads = []) {
  const wonLeads = leads.filter((lead) => lead.status === "Won" && lead.wonAt && lead.createdAt);
  if (wonLeads.length === 0) return 0;

  const totalDays = wonLeads.reduce((sum, lead) => {
    const start = new Date(lead.createdAt);
    const end = new Date(lead.wonAt);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return sum + (Number.isFinite(diffDays) ? diffDays : 0);
  }, 0);

  return Math.round(totalDays / wonLeads.length);
}

/**
 * Computes Lost Rate (Lost Leads / Total Leads).
 *
 * @param {Array<Object>} leads - Array of leads.
 * @returns {number} Lost percentage.
 */
export function getLostRate(leads = []) {
  const total = leads.length;
  if (total === 0) return 0;
  const lost = leads.filter((lead) => lead.status === "Lost").length;
  return Math.round((lost / total) * 100);
}

/**
 * Aggregates and sorts lead counts by source.
 *
 * @param {Array<Object>} leads - Array of leads.
 * @returns {Array<Object>} Sorted list of lead sources.
 */
export function getLeadSourceStats(leads = []) {
  const stats = {};
  leads.forEach((lead) => {
    const src = lead.source || "Other";
    stats[src] = (stats[src] || 0) + 1;
  });

  return Object.entries(stats)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Computes the cumulative funnel data counts and percentages.
 *
 * @param {Array<Object>} leads - Array of leads.
 * @returns {Array<Object>} Funnel stages stats.
 */
export function getFunnelData(leads = []) {
  const totalLeads = leads.length;
  
  // Cumulative progression funnel mapping:
  // - New: all leads
  // - Contacted: leads at status Contacted, Meeting, Proposal, Won
  // - Meeting: leads at status Meeting, Proposal, Won
  // - Proposal: leads at status Proposal, Won
  // - Won: leads at status Won
  const counts = {
    New: totalLeads,
    Contacted: leads.filter((l) => ["Contacted", "Meeting Scheduled", "Meeting", "Proposal Sent", "Proposal", "Won"].includes(l.status)).length,
    Meeting: leads.filter((l) => ["Meeting Scheduled", "Meeting", "Proposal Sent", "Proposal", "Won"].includes(l.status)).length,
    Proposal: leads.filter((l) => ["Proposal Sent", "Proposal", "Won"].includes(l.status)).length,
    Won: leads.filter((l) => l.status === "Won").length,
  };

  return [
    { stage: "New", value: counts.New, pct: 100, drop: 0 },
    {
      stage: "Contacted",
      value: counts.Contacted,
      pct: counts.New > 0 ? Math.round((counts.Contacted / counts.New) * 100) : 0,
      drop: counts.New > 0 ? 100 - Math.round((counts.Contacted / counts.New) * 100) : 0,
    },
    {
      stage: "Meeting",
      value: counts.Meeting,
      pct: counts.Contacted > 0 ? Math.round((counts.Meeting / counts.New) * 100) : 0,
      drop: counts.Contacted > 0 ? 100 - Math.round((counts.Meeting / counts.Contacted) * 100) : 0,
    },
    {
      stage: "Proposal",
      value: counts.Proposal,
      pct: counts.Meeting > 0 ? Math.round((counts.Proposal / counts.New) * 100) : 0,
      drop: counts.Meeting > 0 ? 100 - Math.round((counts.Proposal / counts.Meeting) * 100) : 0,
    },
    {
      stage: "Won",
      value: counts.Won,
      pct: counts.Proposal > 0 ? Math.round((counts.Won / counts.New) * 100) : 0,
      drop: counts.Proposal > 0 ? 100 - Math.round((counts.Won / counts.Proposal) * 100) : 0,
    },
  ];
}

/**
 * Computes Sales Velocity.
 * (Opportunities * Win Rate * Avg Deal Size) / Sales Cycle Length
 *
 * @param {Array<Object>} leads - Array of leads.
 * @returns {number} Sales velocity value per day.
 */
export function getSalesVelocity(leads = []) {
  const activeCount = leads.filter((lead) => !["Won", "Lost"].includes(lead.status)).length;
  
  const totalCount = leads.length;
  const wonLeads = leads.filter((lead) => lead.status === "Won");
  const winRate = totalCount > 0 ? wonLeads.length / totalCount : 0;
  
  const avgDealSize = wonLeads.length > 0 
    ? wonLeads.reduce((sum, lead) => sum + parseDealValue(lead.value), 0) / wonLeads.length 
    : 0;

  const cycleDays = Math.max(1, getAverageSalesCycle(leads));

  return Math.round((activeCount * winRate * avgDealSize) / cycleDays);
}

/**
 * Predicts next month revenue.
 * Based on average monthly won revenue over the last 6 months.
 *
 * @param {Array<Object>} leads - Array of leads.
 * @returns {number} Predicted next month revenue.
 */
export function getForecastRevenue(leads = []) {
  const monthlyRevenue = getRevenueByMonth(leads);
  if (monthlyRevenue.length === 0) return 0;
  
  const totalWonRev = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  return Math.round(totalWonRev / monthlyRevenue.length);
}

/**
 * Groups and sums won revenue per salesperson owner.
 *
 * @param {Array<Object>} leads - Array of leads.
 * @returns {Array<Object>} Reps ranked by won revenue.
 */
export function getTopPerformers(leads = []) {
  const reps = {};
  leads.forEach((lead) => {
    if (lead.status !== "Won") return;
    const repName = lead.owner || "Unassigned";
    reps[repName] = (reps[repName] || 0) + parseDealValue(lead.value);
  });

  return Object.entries(reps)
    .map(([owner, revenue]) => ({ owner, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Prepares data for activity heatmap grid (dates of the current month).
 *
 * @param {Array<Object>} leads - Array of leads.
 * @returns {Array<Object>} List of dates with activity counts.
 */
export function getActivityHeatmapData(leads = []) {
  const activityMap = {};
  
  leads.forEach((lead) => {
    // 1. Leads Created
    if (lead.createdAt || lead.dateAdded) {
      const d = parseLeadDate(lead);
      const dateStr = d.toISOString().split("T")[0];
      activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
    }
    // 2. Meetings Scheduled
    if (lead.meetingAt) {
      try {
        const dateStr = new Date(lead.meetingAt).toISOString().split("T")[0];
        activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
      } catch {
        // ignore date parsing error
      }
    }
    // 3. Calls Logged / Contacted
    if (lead.contactedAt) {
      try {
        const dateStr = new Date(lead.contactedAt).toISOString().split("T")[0];
        activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
      } catch {
        // ignore date parsing error
      }
    }
  });

  // Generate date entries for the last 30 days
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    data.push({
      date: dateStr,
      count: activityMap[dateStr] || 0,
    });
  }

  return data;
}
