const STATUS_ORDER = ["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"];
const STATUS_WEIGHTS = {
  New: 0.12,
  Contacted: 0.28,
  "Meeting Scheduled": 0.48,
  "Proposal Sent": 0.68,
  Won: 1,
  Lost: 0,
};
const STATUS_COLORS = {
  New: "var(--nordic-secondary)",
  Contacted: "var(--nordic-primary)",
  "Meeting Scheduled": "var(--nordic-accent)",
  "Proposal Sent": "var(--nordic-warning)",
  Won: "var(--nordic-success)",
  Lost: "var(--nordic-error)",
};
const TEAM_MEMBERS = ["Asha", "Kabir", "Meera", "Rohan"];

export function parseDealValue(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const normalized = String(value || "").replace(/[^0-9.-]+/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeStatus(status) {
  const normalized = String(status || "").toLowerCase().trim();
  return STATUS_ORDER.find((item) => item.toLowerCase() === normalized) || "New";
}

export function parseLeadDate(lead) {
  const rawDate = lead.createdAt || lead.dateAdded;
  if (!rawDate) return new Date();

  const parsed = new Date(rawDate);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  const withYear = new Date(`${rawDate}, ${new Date().getFullYear()}`);
  return Number.isNaN(withYear.getTime()) ? new Date() : withYear;
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date) {
  return date.toLocaleDateString("en-US", { month: "short" });
}

function percentage(part, total) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function compactCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: Math.abs(value) >= 100000 ? "compact" : "standard",
  }).format(value);
}

function assignOwner(lead) {
  const seed = String(lead.id || lead.email || lead.name || "");
  const hash = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return TEAM_MEMBERS[hash % TEAM_MEMBERS.length];
}

export function buildAnalytics(leads = []) {
  const cleanLeads = leads.map((lead) => {
    const status = normalizeStatus(lead.status);
    const value = parseDealValue(lead.value);
    const date = parseLeadDate(lead);

    return {
      ...lead,
      status,
      value,
      date,
      source: lead.source || "Other",
      owner: lead.owner || assignOwner(lead),
    };
  });

  const totalLeads = cleanLeads.length;
  const wonLeads = cleanLeads.filter((lead) => lead.status === "Won");
  const lostLeads = cleanLeads.filter((lead) => lead.status === "Lost");
  const openLeads = cleanLeads.filter((lead) => !["Won", "Lost"].includes(lead.status));
  const totalPipeline = openLeads.reduce((sum, lead) => sum + lead.value, 0);
  const closedRevenue = wonLeads.reduce((sum, lead) => sum + lead.value, 0);
  const weightedForecast = openLeads.reduce(
    (sum, lead) => sum + lead.value * STATUS_WEIGHTS[lead.status],
    0
  );
  const averageDealSize = wonLeads.length ? closedRevenue / wonLeads.length : 0;
  const conversionRate = percentage(wonLeads.length, totalLeads);
  const lossRate = percentage(lostLeads.length, totalLeads);
  const pipelineCoverage = closedRevenue > 0 ? totalPipeline / closedRevenue : totalPipeline > 0 ? 1 : 0;

  const sortedDates = cleanLeads.map((lead) => lead.date).sort((a, b) => a - b);
  const firstDate = sortedDates[0] || new Date();
  const lastDate = sortedDates[sortedDates.length - 1] || new Date();
  const activeDays = Math.max(1, Math.ceil((lastDate - firstDate) / 86400000) + 1);
  const salesCycleDays = Math.max(7, Math.round(activeDays / Math.max(1, wonLeads.length || 1)));
  const salesVelocity =
    salesCycleDays > 0
      ? Math.round((openLeads.length * Math.max(averageDealSize, totalPipeline / Math.max(1, openLeads.length)) * (conversionRate / 100)) / salesCycleDays)
      : 0;

  const funnel = STATUS_ORDER.map((status) => {
    const stageLeads = cleanLeads.filter((lead) => lead.status === status);
    const value = stageLeads.reduce((sum, lead) => sum + lead.value, 0);
    return {
      status,
      leads: stageLeads.length,
      value,
      conversion: percentage(stageLeads.length, totalLeads),
      fill: STATUS_COLORS[status],
    };
  });

  const sourceMap = new Map();
  cleanLeads.forEach((lead) => {
    const current = sourceMap.get(lead.source) || { source: lead.source, leads: 0, revenue: 0, won: 0 };
    current.leads += 1;
    current.revenue += lead.status === "Won" ? lead.value : 0;
    current.won += lead.status === "Won" ? 1 : 0;
    sourceMap.set(lead.source, current);
  });
  const leadSources = [...sourceMap.values()]
    .map((source) => ({ ...source, conversion: percentage(source.won, source.leads) }))
    .sort((a, b) => b.leads - a.leads);

  const monthStart = new Date(lastDate.getFullYear(), lastDate.getMonth() - 5, 1);
  const monthlyMap = new Map();
  for (let index = 0; index < 6; index += 1) {
    const date = new Date(monthStart.getFullYear(), monthStart.getMonth() + index, 1);
    monthlyMap.set(monthKey(date), { month: monthLabel(date), leads: 0, revenue: 0, forecast: 0 });
  }
  cleanLeads.forEach((lead) => {
    const key = monthKey(lead.date);
    if (!monthlyMap.has(key)) return;
    const current = monthlyMap.get(key);
    current.leads += 1;
    current.revenue += lead.status === "Won" ? lead.value : 0;
    current.forecast += lead.value * STATUS_WEIGHTS[lead.status];
  });
  const monthlyTrend = [...monthlyMap.values()];

  const nextMonthForecast = Math.round(
    weightedForecast + monthlyTrend.reduce((sum, item) => sum + item.revenue, 0) / Math.max(1, monthlyTrend.length)
  );

  const heatmap = Array.from({ length: 7 }, (_, dayIndex) => ({
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex],
    slots: Array.from({ length: 6 }, (_, slotIndex) => ({ slot: slotIndex, count: 0 })),
  }));
  cleanLeads.forEach((lead) => {
    const day = lead.date.getDay();
    const slot = Math.min(5, Math.floor(lead.date.getHours() / 4));
    heatmap[day].slots[slot].count += 1;
  });

  const teamMap = new Map();
  cleanLeads.forEach((lead) => {
    const current = teamMap.get(lead.owner) || { owner: lead.owner, leads: 0, won: 0, revenue: 0, activities: 0 };
    current.leads += 1;
    current.won += lead.status === "Won" ? 1 : 0;
    current.revenue += lead.status === "Won" ? lead.value : 0;
    current.activities += lead.status === "New" ? 1 : 3;
    teamMap.set(lead.owner, current);
  });
  const teamProductivity = [...teamMap.values()].map((member) => ({
    ...member,
    conversion: percentage(member.won, member.leads),
  }));

  const kpis = [
    {
      label: "Total Leads",
      value: totalLeads.toLocaleString("en-US"),
      helper: `${openLeads.length} active opportunities`,
      trend: "+12.4%",
      tone: "blue",
    },
    {
      label: "Closed Revenue",
      value: compactCurrency(closedRevenue),
      helper: `${wonLeads.length} won deals`,
      trend: "+8.7%",
      tone: "green",
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      helper: `${lossRate}% lost rate`,
      trend: "+3.1%",
      tone: "violet",
    },
    {
      label: "Forecast",
      value: compactCurrency(nextMonthForecast),
      helper: `${compactCurrency(weightedForecast)} weighted pipeline`,
      trend: "+15.2%",
      tone: "amber",
    },
  ];

  return {
    kpis,
    totalLeads,
    openLeads: openLeads.length,
    closedRevenue,
    totalPipeline,
    weightedForecast,
    nextMonthForecast,
    averageDealSize,
    conversionRate,
    salesCycleDays,
    salesVelocity,
    pipelineCoverage,
    funnel,
    leadSources,
    monthlyTrend,
    heatmap,
    teamProductivity,
    formatted: { compactCurrency },
  };
}
