import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

/**
 * Custom Tooltip for Line Chart with dark glass backdrop.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950/80 backdrop-blur-md text-white p-3 text-xs font-semibold rounded-xl shadow-xl border border-white/10">
        <p className="font-bold text-slate-350">{data.month}</p>
        <p className="mt-1 text-emerald-400 font-bold text-sm">Conversion Rate: {data.rate}%</p>
      </div>
    );
  }
  return null;
};

/**
 * LineChartCard component showing monthly lead conversion rate.
 */
export function LineChartCard({ data = [] }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[20px] shadow-md border border-slate-200/40 dark:border-slate-800/30 flex flex-col justify-between h-96 transition-all duration-300"
    >
      <div>
        <h3 className="text-base font-bold text-slate-950 dark:text-white">Conversion Rate Trends</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Monthly closed-won lead percentage timeline</p>
      </div>

      <div className="h-64 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
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
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#10B981" // Success Emerald
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, stroke: "#10B981", fill: "var(--brand-surface)" }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#10B981" }}
              isAnimationActive={true}
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default LineChartCard;
