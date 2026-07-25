import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

const COLORS = {
  New: "#3B82F6",         // Primary Blue
  Contacted: "#8B5CF6",   // Purple
  Meeting: "#06B6D4",     // Accent Cyan
  Proposal: "#F59E0B",   // Warning Amber
  Won: "#10B981",        // Success Emerald
  Lost: "#EF4444",       // Danger Red
};

/**
 * Custom Tooltip to display exact status numbers and percentages with high-fidelity blur backdrop.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950/80 backdrop-blur-md text-white p-3 text-xs font-semibold rounded-xl shadow-xl border border-white/10">
        <p className="font-bold text-slate-350">{data.name}</p>
        <p className="mt-1 font-bold text-base text-white">{data.value} Leads</p>
        <p className="text-cyan-400 font-bold mt-0.5">{data.percentage}% of total</p>
      </div>
    );
  }
  return null;
};

/**
 * PieChartCard component showing status distribution in a premium glass deck.
 */
export function PieChartCard({ data = [] }) {
  const totalLeads = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[20px] shadow-md border border-slate-200/40 dark:border-slate-800/30 flex flex-col justify-between h-96 transition-all duration-300"
    >
      <div>
        <h3 className="text-base font-bold text-slate-950 dark:text-white">Pipeline Distribution</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Breakdown of leads by sales pipeline status</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 flex-1 mt-4">
        {/* Responsive Pie Container */}
        <div className="w-full sm:w-1/2 h-48 relative flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={78}
                paddingAngle={4}
                dataKey="value"
                isAnimationActive={true}
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || "#94A3B8"} className="stroke-white dark:stroke-slate-900 stroke-2 outline-none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute text-center pointer-events-none flex flex-col justify-center items-center">
            <span className="text-3xl font-black text-slate-950 dark:text-white leading-none">
              {totalLeads}
            </span>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1.5">
              Total Leads
            </span>
          </div>
        </div>

        {/* Legend Panel */}
        <div className="w-full sm:w-1/2 flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
          {data.map((item) => {
            const color = COLORS[item.name] || "#94A3B8";
            return (
              <div key={item.name} className="flex justify-between items-center text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-slate-700 dark:text-slate-350">{item.name}</span>
                </div>
                <span className="text-slate-800 dark:text-slate-200">
                  {item.value} <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">({item.percentage}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default PieChartCard;
