import { Trophy, Award } from "lucide-react";
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
 * TopPerformersCard component.
 * Displays representatives ranked by total won revenue values.
 */
export function TopPerformersCard({ data = [] }) {
  const hasPerformers = data.length > 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[20px] shadow-md border border-slate-200/40 dark:border-slate-800/30 flex flex-col justify-between h-96 transition-all duration-300"
    >
      <div>
        <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">Top Performers</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Sales reps ranked by closed-won deal values</p>
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
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/40 dark:border-slate-800/30 bg-slate-50/50 dark:bg-slate-850/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Rank identifier */}
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm ${
                      isFirst
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : isSecond
                        ? "bg-slate-105 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        : isThird
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-white dark:bg-slate-905 text-slate-500 dark:text-gray-400 border border-slate-200/50 dark:border-slate-800"
                    }`}
                  >
                    {isFirst ? (
                      <Trophy size={14} className="fill-yellow-500/20 text-yellow-500" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{rep.owner}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-950 dark:text-white">
                    {formatUSD(rep.revenue)}
                  </span>
                  {isFirst && <Award size={15} className="text-yellow-500 animate-pulse stroke-[2.25]" />}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-10">
            <Trophy size={32} className="stroke-[1.5] text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-xs font-semibold text-slate-455">No sales activity logged yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default TopPerformersCard;
