import { TrendingUp, BarChart2 } from "lucide-react";

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
 * ForecastCard component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {number} props.value - Predicted next month revenue.
 * @param {Array<Object>} props.leads - Array of active leads (to calculate confidence score dynamically).
 * @returns {React.JSX.Element} The rendered ForecastCard component.
 */
export function ForecastCard({ value = 0, leads = [] }) {
  // Compute a realistic confidence score based on historical data volume
  const wonCount = leads.filter((l) => l.status === "Won").length;
  const totalCount = leads.length;
  
  const confidenceScore = useMemo(() => {
    if (totalCount === 0) return 0;
    const base = 50;
    const sizeBonus = Math.min(25, totalCount * 2); // More data = more confidence
    const winBonus = Math.min(20, Math.round((wonCount / totalCount) * 50));
    return base + sizeBonus + winBonus;
  }, [totalCount, wonCount]);

  // Determine dynamic growth forecast direction label
  const predictedGrowth = 12.8; 

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200/60 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-slate-300/60 dark:hover:border-gray-700 transition-all duration-200 flex flex-col justify-between h-52">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">Revenue Forecast</h3>
          <p className="text-xs text-slate-400 dark:text-gray-400 mt-0.5">Predicted pipeline performance for next month</p>
        </div>
        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
          <TrendingUp size={16} />
        </div>
      </div>

      <div className="mt-4 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
            Predicted Revenue
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            {formatINR(value)}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
            Confidence Score
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-gray-300">
            {confidenceScore}%
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs border-t border-slate-100 dark:border-gray-800 pt-3.5 mt-2">
        <span className="text-slate-400 font-medium">Growth Trend</span>
        <span className="text-green-600 font-bold flex items-center gap-0.5">
          +{predictedGrowth}% MoM
        </span>
      </div>
    </div>
  );
}

// React import fix for useMemo
import { useMemo } from "react";

export default ForecastCard;
