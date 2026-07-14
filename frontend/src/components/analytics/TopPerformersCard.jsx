import { Trophy, Award } from "lucide-react";

/**
 * Format helper for Indian Rupees localized formatting.
 */
function formatINR(val) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

/**
 * TopPerformersCard component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.data - Reps ranked by won revenue dataset from useAnalytics.
 * @returns {React.JSX.Element} The rendered TopPerformersCard component.
 */
export function TopPerformersCard({ data = [] }) {
  // If no won revenue data is available, display a simple mock indicator
  const hasPerformers = data.length > 0;

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200/60 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-slate-300/60 dark:hover:border-gray-700 transition-all duration-200 flex flex-col justify-between h-96">
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">Top Performers</h3>
        <p className="text-xs text-slate-400 dark:text-gray-400 mt-0.5">Sales reps ranked by closed-won deal values</p>
      </div>

      <div className="flex-1 overflow-y-auto mt-6 space-y-3.5 pr-1">
        {hasPerformers ? (
          data.map((rep, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;
            const isThird = idx === 2;

            return (
              <div
                key={rep.owner}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-gray-850 bg-slate-50/40 dark:bg-gray-800/40 hover:bg-slate-50 dark:hover:bg-gray-850 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Rank identifier */}
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isFirst
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : isSecond
                        ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        : isThird
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-white dark:bg-gray-900 text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-800"
                    }`}
                  >
                    {isFirst ? (
                      <Trophy size={14} className="fill-yellow-500/20" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{rep.owner}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-800 dark:text-white">
                    {formatINR(rep.revenue)}
                  </span>
                  {isFirst && <Award size={16} className="text-yellow-500 animate-pulse" />}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <Trophy size={32} className="stroke-[1.5] text-slate-300 mb-2" />
            <p className="text-xs font-medium">No sales representatives have closed deals yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopPerformersCard;
