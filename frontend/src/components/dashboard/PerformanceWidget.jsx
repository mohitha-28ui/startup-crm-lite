import { Target, TrendingUp, DollarSign, Award } from "lucide-react";
import { motion } from "framer-motion";

/**
 * PerformanceWidget component renders target progress rings and goal charts.
 * Calculates won deals vs monthly targets and won revenue achievement.
 */
function PerformanceWidget({ leads = [] }) {
  // Goals configurations
  const MONTHLY_LEADS_TARGET = 10;
  const MONTHLY_REVENUE_TARGET = 100000; // $100,000

  // 1. Calculate values
  const wonLeads = leads.filter(
    (lead) => String(lead.status || "").toLowerCase() === "won"
  ).length;

  const wonRevenue = leads
    .filter((lead) => String(lead.status || "").toLowerCase() === "won")
    .reduce((sum, lead) => {
      const val = parseFloat(String(lead.value || "0").replace(/[^0-9.]/g, "")) || 0;
      return sum + val;
    }, 0);

  // 2. Calculations percentages
  const leadProgressPercent = Math.min(
    100,
    Math.round((wonLeads / MONTHLY_LEADS_TARGET) * 100)
  );

  const revenueProgressPercent = Math.min(
    100,
    Math.round((wonRevenue / MONTHLY_REVENUE_TARGET) * 100)
  );

  // Progress circle configuration
  const radius = 34;
  const strokeWidth = 6.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (leadProgressPercent / 100) * circumference;

  return (
    <div className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[20px] shadow-md border border-slate-200/40 dark:border-slate-800/30 flex flex-col justify-between h-full">
      <div className="space-y-5">
        {/* Header Title */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Target size={18} className="stroke-[2.25]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Performance Goals</h3>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Target Analytics</p>
            </div>
          </div>
        </div>

        {/* Ring & Details row */}
        <div className="flex flex-col sm:flex-row items-center gap-5 justify-around py-2">
          {/* Circular Ring SVG */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              {/* Gray track */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-slate-100 dark:text-slate-800"
              />
              {/* Highlight arc */}
              <motion.circle
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                cx="40"
                cy="40"
                r={radius}
                fill="transparent"
                stroke="url(#ringGrad)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-black text-slate-950 dark:text-white leading-none">
                {leadProgressPercent}%
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">
                Leads
              </span>
            </div>
          </div>

          {/* Details Column */}
          <div className="space-y-4 flex-1 w-full max-w-[200px]">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Won Leads Goal</span>
                <span className="font-bold text-slate-900 dark:text-white">{wonLeads}/{MONTHLY_LEADS_TARGET}</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${leadProgressPercent}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Revenue Target</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ${Math.round(wonRevenue / 1000)}k/${Math.round(MONTHLY_REVENUE_TARGET / 1000)}k
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${revenueProgressPercent}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Metrics Card */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-200/30 dark:border-slate-800/20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-500" />
            <div>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Revenue Won</p>
              <p className="text-sm font-extrabold text-slate-950 dark:text-white">
                ${wonRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
            <TrendingUp size={12} strokeWidth={2.5} />
            <span>Target Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceWidget;
