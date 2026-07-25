import { FunnelChart, Funnel, Cell, ResponsiveContainer, Tooltip, LabelList } from "recharts";
import { motion } from "framer-motion";

const STAGE_COLORS = {
  New: "#3B82F6",         // Primary Blue
  Contacted: "#8B5CF6",   // Purple
  Meeting: "#06B6D4",     // Accent Cyan
  Proposal: "#F59E0B",   // Warning Amber
  Won: "#10B981",        // Success Emerald
};

/**
 * Custom Tooltip component for Funnel Chart with glass filter.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950/80 backdrop-blur-md text-white p-3 text-xs font-semibold rounded-xl shadow-xl border border-white/10">
        <p className="text-slate-300 font-bold">{data.stage} Stage</p>
        <p className="mt-1 font-bold text-sm text-white">{data.value} Leads</p>
        <p className="text-emerald-400 font-bold mt-0.5">Conversion: {data.pct}%</p>
        {data.stage !== "New" && (
          <p className="text-rose-455 font-bold">Drop-off: {data.drop}%</p>
        )}
      </div>
    );
  }
  return null;
};

/**
 * FunnelChartCard component showing sales funnel stages.
 */
export function FunnelChartCard({ data = [] }) {
  const getStageColor = (stage) => {
    return STAGE_COLORS[stage] || "#94A3B8";
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[20px] shadow-md border border-slate-200/40 dark:border-slate-800/30 flex flex-col justify-between h-96 transition-all duration-300"
    >
      <div>
        <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">Sales Pipeline Funnel</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Pipeline stage conversion and drop-off analysis</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 flex-1 mt-4">
        {/* Recharts Funnel Chart Container */}
        <div className="w-full sm:w-1/2 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip content={<CustomTooltip />} />
              <Funnel
                dataKey="value"
                data={data}
                nameKey="stage"
                isAnimationActive
              >
                <LabelList position="right" fill="var(--nordic-text-secondary)" stroke="none" dataKey="stage" fontSize={11} fontWeight={600} />
                {data.map((entry) => (
                  <Cell key={`cell-${entry.stage}`} fill={getStageColor(entry.stage)} className="stroke-white dark:stroke-slate-900 stroke-1 outline-none" />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Metrics Panel */}
        <div className="w-full sm:w-1/2 flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
          {data.map((item) => {
            const color = getStageColor(item.stage);
            return (
              <div key={item.stage} className="flex flex-col border border-slate-200/40 dark:border-slate-800/30 p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-850/30">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-slate-700 dark:text-slate-300">{item.stage}</span>
                  </div>
                  <span className="text-slate-800 dark:text-white">{item.value} Leads</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">
                  <span>Conv: {item.pct}%</span>
                  {item.stage !== "New" && (
                    <span className="text-rose-500 dark:text-rose-400 font-bold">Drop: {item.drop}%</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default FunnelChartCard;
