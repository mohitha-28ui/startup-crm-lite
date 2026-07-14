import { ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";

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
 * SalesVelocityCard component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.data - Sales velocity data { value, growth }.
 * @returns {React.JSX.Element} The rendered SalesVelocityCard component.
 */
export function SalesVelocityCard({ data }) {
  const { value = 0, growth = 0 } = data;
  const isPositive = growth > 0;
  const hasGrowth = growth !== 0;

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200/60 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-slate-300/60 dark:hover:border-gray-700 transition-all duration-200 flex flex-col justify-between h-52">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">Sales Velocity</h3>
          <p className="text-xs text-slate-400 dark:text-gray-400 mt-0.5">Rate of pipeline converted per day</p>
        </div>
        <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-100 dark:border-amber-900/40">
          <Zap size={16} className="fill-amber-600/10" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
          {formatINR(value)} <span className="text-xs font-semibold text-slate-400 dark:text-gray-500">/ day</span>
        </div>

        <div className="flex items-center gap-1 text-xs">
          {hasGrowth && (
            isPositive ? (
              <ArrowUpRight size={14} className="text-green-600 dark:text-green-400 font-bold" />
            ) : (
              <ArrowDownRight size={14} className="text-red-600 dark:text-red-400 font-bold" />
            )
          )}
          <span
            className={`font-semibold ${
              !hasGrowth ? "text-slate-400 dark:text-gray-500" : isPositive ? "text-green-600 dark:text-green-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {hasGrowth ? `${Math.abs(growth)}%` : "0%"}
          </span>
          <span className="text-slate-400 dark:text-gray-500 font-medium ml-0.5">vs last period</span>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 dark:text-gray-500 font-medium leading-normal border-t border-slate-100 dark:border-gray-800 pt-3.5">
        Formula: (Opportunities × Win Rate × Avg Deal Size) ÷ Sales Cycle Length. Represents average daily pipeline conversion value.
      </div>
    </div>
  );
}

export default SalesVelocityCard;
