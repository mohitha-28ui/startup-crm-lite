import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
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
 * ForecastCard component.
 * Displays predicted next month revenue and confidence scores based on active pipeline volumes.
 */
export function ForecastCard({ value = 0, leads = [] }) {
  const wonCount = leads.filter((l) => l.status === "Won").length;
  const totalCount = leads.length;
  
  const confidenceScore = useMemo(() => {
    if (totalCount === 0) return 0;
    const base = 50;
    const sizeBonus = Math.min(25, totalCount * 2);
    const winBonus = Math.min(20, Math.round((wonCount / totalCount) * 50));
    return base + sizeBonus + winBonus;
  }, [totalCount, wonCount]);

  const predictedGrowth = 12.8; 

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[20px] shadow-md border border-slate-200/40 dark:border-slate-800/30 flex flex-col justify-between h-52 transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">Revenue Forecast</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Predicted pipeline performance for next month</p>
        </div>
        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-655 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm shrink-0">
          <TrendingUp size={16} className="stroke-[2.25]" />
        </div>
      </div>

      <div className="mt-4 flex justify-between items-end">
        <div>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Predicted Revenue
          </span>
          <div className="text-2xl font-black text-slate-955 dark:text-white tracking-tight leading-none">
            {formatUSD(value)}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Confidence Score
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {confidenceScore}%
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs border-t border-slate-100 dark:border-slate-800/40 pt-3.5 mt-2 font-semibold">
        <span className="text-slate-400 font-medium">Growth Trend</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
          +{predictedGrowth}% MoM
        </span>
      </div>
    </motion.div>
  );
}

export default ForecastCard;
