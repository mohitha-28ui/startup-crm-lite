/**
 * Helper to get color density based on activity count.
 *
 * @param {number} count - Activity occurrences.
 * @returns {string} Tailwind CSS background class.
 */
function getDensityColor(count) {
  if (count === 0) return "bg-slate-100 dark:bg-gray-800 border-slate-200/50 dark:border-gray-700/50 text-slate-400 dark:text-gray-500 hover:bg-slate-200 dark:hover:bg-gray-750";
  if (count <= 1) return "bg-blue-100 dark:bg-blue-950/45 border-blue-200 dark:border-blue-900/40 text-blue-800 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50";
  if (count <= 3) return "bg-blue-300 dark:bg-blue-900/60 border-blue-400 dark:border-blue-800 text-blue-900 dark:text-blue-300 hover:bg-blue-400 dark:hover:bg-blue-900/80";
  if (count <= 5) return "bg-blue-500 dark:bg-blue-600 border-blue-600 dark:border-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500";
  return "bg-blue-700 dark:bg-blue-500 border-blue-800 dark:border-blue-400 text-white hover:bg-blue-800 dark:hover:bg-blue-400";
}

/**
 * ActivityHeatmap component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.data - Daily activity count dataset from useAnalytics.
 * @returns {React.JSX.Element} The rendered ActivityHeatmap component.
 */
export function ActivityHeatmap({ data = [] }) {
  // Format date string for displaying in tooltips (e.g., "Jun 12, 2026")
  const formatDateStr = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200/60 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-slate-300/60 dark:hover:border-gray-700 transition-all duration-200 flex flex-col justify-between h-96">
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">Sales Activity Heatmap</h3>
        <p className="text-xs text-slate-400 dark:text-gray-400 mt-0.5">Leads created, calls logged, and meetings scheduled (last 30 days)</p>
      </div>

      {/* Grid of contribution squares */}
      <div className="my-6 flex justify-center items-center flex-1">
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-3">
          {data.map((day) => {
            const colorClass = getDensityColor(day.count);
            const formattedDate = formatDateStr(day.date);
            return (
              <div
                key={day.date}
                className={`group relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl border flex items-center justify-center text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm ${colorClass}`}
              >
                {/* Short text count inside for clarity */}
                <span>{day.count}</span>

                {/* Hover Tooltip tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                  <div className="bg-slate-900 text-white text-[10px] font-semibold py-1.5 px-2.5 rounded-lg shadow-xl border border-slate-850 whitespace-nowrap">
                    <p className="font-bold">{formattedDate}</p>
                    <p className="text-blue-400 mt-0.5">{day.count} activities logged</p>
                  </div>
                  <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-gray-500 font-semibold border-t border-slate-100 dark:border-gray-800 pt-3.5">
        <span>Less activity</span>
        <div className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700" title="0 activities" />
          <span className="h-3.5 w-3.5 rounded bg-blue-100 dark:bg-blue-950/45 border border-blue-200 dark:border-blue-900/40" title="1 activity" />
          <span className="h-3.5 w-3.5 rounded bg-blue-300 dark:bg-blue-900/60 border border-blue-400 dark:border-blue-800" title="2-3 activities" />
          <span className="h-3.5 w-3.5 rounded bg-blue-500 dark:bg-blue-600 border border-blue-600 dark:border-blue-500" title="4-5 activities" />
          <span className="h-3.5 w-3.5 rounded bg-blue-700 dark:bg-blue-500 border border-blue-800 dark:border-blue-400" title="6+ activities" />
        </div>
        <span>More activity</span>
      </div>
    </div>
  );
}

export default ActivityHeatmap;
