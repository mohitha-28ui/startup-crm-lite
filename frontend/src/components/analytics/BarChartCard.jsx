import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

/**
 * Custom Tooltip for Bar Chart with glass blur.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950/80 backdrop-blur-md text-white p-3 text-xs font-semibold rounded-xl shadow-xl border border-white/10">
        <p className="font-bold text-slate-350">{data.month}</p>
        <p className="mt-1 font-bold text-sm text-blue-400">{data.count} Leads Acquired</p>
      </div>
    );
  }
  return null;
};

/**
 * BarChartCard component showing monthly lead generation trends.
 */
export function BarChartCard({ data = [] }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[20px] shadow-md border border-slate-200/40 dark:border-slate-800/30 flex flex-col justify-between h-96 transition-all duration-300"
    >
      <div>
        <h3 className="text-base font-bold text-slate-950 dark:text-white">Lead Acquisition Trends</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Lead acquisition volumes for the last 6 months</p>
      </div>

      <div className="h-64 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.12)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--nordic-text-secondary)", fontSize: 11, fontWeight: 605 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--nordic-text-secondary)", fontSize: 11, fontWeight: 605 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(37, 99, 235, 0.05)" }} />
            <Bar
              dataKey="count"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
              isAnimationActive={true}
              barSize={26}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default BarChartCard;
