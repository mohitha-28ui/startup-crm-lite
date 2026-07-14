import { Calendar } from "lucide-react";

/**
 * AnalyticsFilters component for date range selection.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.filterRange - The currently active filter range.
 * @param {function} props.onRangeChange - Handler when range is changed.
 * @param {Object} props.customRange - Store for custom startDate/endDate values.
 * @param {function} props.onCustomRangeChange - Handler for updating custom range entries.
 * @returns {React.JSX.Element} The rendered AnalyticsFilters component.
 */
export function AnalyticsFilters({
  filterRange,
  onRangeChange,
  customRange,
  onCustomRangeChange,
}) {
  const options = ["7 Days", "30 Days", "90 Days", "This Year", "All", "Custom"];

  return (
    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-slate-200/60 dark:border-gray-800 shadow-sm transition-all duration-200">
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isActive = filterRange === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onRangeChange(opt)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-blue-600 dark:bg-blue-600 text-white border-blue-600 dark:border-blue-600 shadow-sm"
                  : "bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 border-slate-200 dark:border-gray-750 hover:border-blue-200 dark:hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {filterRange === "Custom" && (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-1.5 border border-slate-200 dark:border-gray-750 rounded-xl px-3 py-1.5 bg-slate-50 dark:bg-gray-800">
            <Calendar size={14} className="text-slate-400 dark:text-gray-500" />
            <input
              type="date"
              aria-label="Start Date"
              className="bg-transparent border-none text-xs text-slate-600 dark:text-gray-300 focus:outline-none focus:ring-0 w-28 cursor-pointer"
              value={customRange.startDate}
              onChange={(e) =>
                onCustomRangeChange((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
          </div>
          <span className="text-xs font-medium text-slate-400 dark:text-gray-500">to</span>
          <div className="flex items-center gap-1.5 border border-slate-200 dark:border-gray-750 rounded-xl px-3 py-1.5 bg-slate-50 dark:bg-gray-800">
            <Calendar size={14} className="text-slate-400 dark:text-gray-500" />
            <input
              type="date"
              aria-label="End Date"
              className="bg-transparent border-none text-xs text-slate-600 dark:text-gray-300 focus:outline-none focus:ring-0 w-28 cursor-pointer"
              value={customRange.endDate}
              onChange={(e) =>
                onCustomRangeChange((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsFilters;
