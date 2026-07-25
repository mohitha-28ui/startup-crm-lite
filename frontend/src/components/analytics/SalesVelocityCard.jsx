import { ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Format helper for USD currency.
 */
function formatUSD(val) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

/**
 * SalesVelocityCard component.
 * Displays pipeline conversion value velocity per calendar day.
 */
export function SalesVelocityCard({ data }) {
  const { value = 0, growth = 0 } = data;
  const isPositive = growth > 0;
  const hasGrowth = growth !== 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[20px] shadow-md border border-slate-200/40 dark:border-slate-800/30 flex flex-col justify-between h-52 transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-bold text-slate-955 dark:text-white tracking-tight">Sales Velocity</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Rate of pipeline converted per day</p>
        </div>
        <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-100 dark:border-amber-900/30 shadow-sm shrink-0">
          <Zap size={16} className="fill-amber-500/10 stroke-[2.25]" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-2xl font-black text-slate-950 dark:text-white tracking-tight leading-none">
          {formatUSD(value)} <span className="text-xs font-bold text-slate-400 dark:text-slate-500">/ day</span>
        </div>

        <div className="flex items-center gap-1 text-xs">
          {hasGrowth && (
            isPositive ? (
              <ArrowUpRight size={14} className="text-emerald-600 dark:text-emerald-400 font-bold" />
            ) : (
              <ArrowDownRight size={14} className="text-rose-600 dark:text-rose-455 font-bold" />
            )
          )}
          <span
            className={`font-extrabold ${
              !hasGrowth ? "text-slate-400" : isPositive ? "text-emerald-600 dark:text-emerald-450" : "text-rose-600 dark:text-rose-455"
            }`}
          >
            {hasGrowth ? `${Math.abs(growth)}%` : "0%"}
          </span>
          <span className="text-slate-400 dark:text-slate-550 font-semibold ml-0.5">vs last period</span>
        </div>
      </div>

      <div className="text-[9px] text-slate-400 dark:text-gray-500 font-semibold leading-relaxed border-t border-slate-100 dark:border-slate-800/40 pt-3.5 mt-2">
        Formula: (Opportunities × Win Rate × Avg Deal Size) ÷ Sales Cycle Length. Represents average daily pipeline conversion value.
      </div>
    </motion.div>
  );
}

export default SalesVelocityCard;
