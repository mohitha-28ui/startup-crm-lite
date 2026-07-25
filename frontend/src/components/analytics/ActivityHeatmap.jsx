import { motion } from "framer-motion";
import { Activity } from "lucide-react";

/**
 * Helper to get color density based on activity count.
 */
function getDensityColor(count) {
  if (count === 0) return "bg-slate-100 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-850/50 text-slate-400 dark:text-gray-550 hover:bg-slate-200 dark:hover:bg-slate-800";
  if (count <= 1) return "bg-blue-50 dark:bg-blue-950/20 border-blue-105/40 dark:border-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30";
  if (count <= 3) return "bg-blue-200 dark:bg-blue-900/40 border-blue-300/40 dark:border-blue-800/30 text-blue-800 dark:text-blue-300 hover:bg-blue-300 dark:hover:bg-blue-900/50";
  if (count <= 5) return "bg-blue-500 dark:bg-blue-600 border-blue-500 dark:border-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500";
  return "bg-blue-700 dark:bg-blue-500 border-blue-800 dark:border-blue-400 text-white hover:bg-blue-800 dark:hover:bg-blue-400";
}

/**
 * ActivityHeatmap component.
 * Displays daily activity counts (leads, calls, meetings) over the last 30 days.
 */
export function ActivityHeatmap({ data = [] }) {
  const formatDateStr = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[20px] shadow-md border border-slate-200/40 dark:border-slate-800/30 flex flex-col justify-between h-96 transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-bold text-slate-955 dark:text-white tracking-tight">Sales Activity Heatmap</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Leads created, calls logged, and meetings scheduled (last 30 days)</p>
        </div>
        <div className="p-2 bg-blue-50/50 dark:bg-slate-950/20 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-105/30 dark:border-slate-800 shadow-sm shrink-0">
          <Activity size={16} className="stroke-[2.25]" />
        </div>
      </div>

      {/* Grid of squares */}
      <div className="my-6 flex justify-center items-center flex-1">
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2.5">
          {data.map((day) => {
            const colorClass = getDensityColor(day.count);
            const formattedDate = formatDateStr(day.date);
            return (
              <div
                key={day.date}
                className={`group relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl border flex items-center justify-center text-[10px] font-bold transition-all duration-200 cursor-pointer shadow-sm ${colorClass}`}
              >
                <span>{day.count}</span>

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2.5 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                  <div className="bg-slate-950 text-white text-[9px] font-bold py-1.5 px-2.5 rounded-lg shadow-xl border border-slate-800 whitespace-nowrap">
                    <p className="font-bold text-slate-300">{formattedDate}</p>
                    <p className="text-blue-400 mt-0.5">{day.count} activities logged</p>
                  </div>
                  <div className="w-1.5 h-1.5 bg-slate-950 rotate-45 -mt-1 border-r border-b border-slate-800"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex justify-between items-center text-[9px] text-slate-400 dark:text-slate-500 font-bold border-t border-slate-100 dark:border-slate-800/40 pt-3.5 mt-2">
        <span>Less activity</span>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-slate-100 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-850/50" title="0 activities" />
          <span className="h-3 w-3 rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-105/40 dark:border-blue-900/20" title="1 activity" />
          <span className="h-3 w-3 rounded-md bg-blue-200 dark:bg-blue-900/40 border border-blue-300/40 dark:border-blue-800/30" title="2-3 activities" />
          <span className="h-3 w-3 rounded-md bg-blue-500 dark:bg-blue-600 border border-blue-500 dark:border-blue-500" title="4-5 activities" />
          <span className="h-3 w-3 rounded-md bg-blue-700 dark:bg-blue-500 border border-blue-800 dark:border-blue-400" title="6+ activities" />
        </div>
        <span>More activity</span>
      </div>
    </motion.div>
  );
}

export default ActivityHeatmap;
