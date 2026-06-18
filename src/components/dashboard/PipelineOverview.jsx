import React from "react";

/**
 * PipelineOverview component displays a horizontal, segmented bar representing
 * the distribution of leads across different pipeline stages.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.leads - Array of lead objects from CRM.
 * @param {number|string} props.leads[].id - Lead ID.
 * @param {string} props.leads[].name - Lead contact name.
 * @param {string} props.leads[].company - Lead company.
 * @param {string|number} props.leads[].value - Lead financial value (e.g. "$5,000").
 * @param {string} props.leads[].status - Lead status (e.g. "New", "Won", "Lost").
 * @returns {React.JSX.Element} The rendered PipelineOverview component.
 */
function PipelineOverview({ leads = [] }) {
  // Normalize configuration for lead statuses
  const STATUS_CONFIG = {
    new: { label: "New", colorClass: "bg-blue-600", textClass: "text-blue-600", bgLight: "bg-blue-50" },
    contacted: { label: "Contacted", colorClass: "bg-indigo-500", textClass: "text-indigo-600", bgLight: "bg-indigo-50" },
    "in progress": { label: "In Progress", colorClass: "bg-amber-500", textClass: "text-amber-600", bgLight: "bg-amber-50" },
    won: { label: "Won", colorClass: "bg-green-500", textClass: "text-green-600", bgLight: "bg-green-50" },
    lost: { label: "Lost", colorClass: "bg-red-500", textClass: "text-red-600", bgLight: "bg-red-50" },
    other: { label: "Other", colorClass: "bg-slate-400", textClass: "text-slate-500", bgLight: "bg-slate-50" },
  };

  /**
   * Helper to extract numeric value from string representations (e.g., "$8,500" -> 8500)
   * @param {string|number} val - The input value.
   * @returns {number} Cleaned numeric value.
   */
  const parseValue = (val) => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.-]+/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  /**
   * Formats numeric values to USD currency representation.
   * @param {number} val - The number to format.
   * @returns {string} Currency string.
   */
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // 1. Group leads and calculate totals
  const totalCount = leads.length;
  const totalValue = leads.reduce((acc, lead) => acc + parseValue(lead.value), 0);

  // Initialize summary counts/values for each status category
  const statusSummary = {
    new: { count: 0, value: 0 },
    contacted: { count: 0, value: 0 },
    "in progress": { count: 0, value: 0 },
    won: { count: 0, value: 0 },
    lost: { count: 0, value: 0 },
    other: { count: 0, value: 0 },
  };

  leads.forEach((lead) => {
    const statusKey = String(lead.status || "").toLowerCase().trim();
    const numericVal = parseValue(lead.value);
    
    if (statusSummary[statusKey]) {
      statusSummary[statusKey].count += 1;
      statusSummary[statusKey].value += numericVal;
    } else {
      statusSummary.other.count += 1;
      statusSummary.other.value += numericVal;
    }
  });

  // Calculate percentages and prepare visual chunks
  const segments = Object.keys(STATUS_CONFIG)
    .map((key) => {
      const summary = statusSummary[key];
      const config = STATUS_CONFIG[key];
      const countPercentage = totalCount > 0 ? (summary.count / totalCount) * 100 : 0;
      const valuePercentage = totalValue > 0 ? (summary.value / totalValue) * 100 : 0;

      return {
        key,
        label: config.label,
        colorClass: config.colorClass,
        textClass: config.textClass,
        bgLight: config.bgLight,
        count: summary.count,
        value: summary.value,
        countPercentage,
        valuePercentage,
      };
    })
    .filter((segment) => segment.count > 0); // Only render/show active stages

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pipeline Deal Flow</h2>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
            Distribution of {totalCount} {totalCount === 1 ? "lead" : "leads"} totaling {formatCurrency(totalValue)}
          </p>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 bg-slate-50 dark:bg-gray-850/50 rounded-xl border border-dashed border-slate-200 dark:border-gray-800">
          <p className="text-sm text-slate-400 dark:text-gray-500 font-medium">No leads currently in the pipeline.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Segmented Progress Bar */}
          <div className="h-5 w-full bg-slate-100 dark:bg-gray-800 rounded-full flex overflow-hidden shadow-inner">
            {segments.map((segment) => (
              <div
                key={segment.key}
                className={`${segment.colorClass} transition-all duration-500 hover:opacity-90 relative group`}
                style={{ width: `${segment.countPercentage}%` }}
              >
                {/* Visual tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-[10px] font-semibold rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {segment.label}: {segment.count} ({Math.round(segment.countPercentage)}%) - {formatCurrency(segment.value)}
                </div>
              </div>
            ))}
          </div>

          {/* Details Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
            {Object.keys(STATUS_CONFIG).map((key) => {
              const config = STATUS_CONFIG[key];
              const summary = statusSummary[key];
              const isActive = summary.count > 0;
              const pct = totalCount > 0 ? Math.round((summary.count / totalCount) * 100) : 0;

              return (
                <div
                  key={key}
                  className={`p-3 rounded-xl border transition-all duration-200 ${
                    isActive
                      ? "border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-850/50 hover:bg-slate-50 dark:hover:bg-gray-800"
                      : "border-slate-50 dark:border-gray-900/40 opacity-40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${config.colorClass}`}></span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-gray-300">{config.label}</span>
                  </div>
                  <div className="mt-2 space-y-0.5">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {summary.count}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-gray-500 font-medium">
                      {formatCurrency(summary.value)} ({pct}%)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default PipelineOverview;
