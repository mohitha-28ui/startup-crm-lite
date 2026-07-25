import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

/**
 * Format helper for localized currency formatting.
 */
function formatCurrency(val) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

/**
 * Custom Tooltip component for Revenue Area Chart.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950/80 backdrop-blur-md text-white p-3 text-xs font-semibold rounded-xl shadow-xl border border-white/10">
        <p className="font-bold text-slate-350">{data.month} Revenue</p>
        <p className="mt-1 text-emerald-450 font-black text-sm">{formatCurrency(data.revenue)}</p>
      </div>
    );
  }
  return null;
};

/**
 * RevenueChartCard component displaying won revenue area history.
 */
export function RevenueChartCard({ data = [] }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[20px] shadow-md border border-slate-200/40 dark:border-slate-800/30 flex flex-col justify-between h-96 transition-all duration-300"
    >
      <div>
        <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">Closed Revenue History</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Total closed-won deal values by month</p>
      </div>

      <div className="h-64 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
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
              tickFormatter={(v) => {
                if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
                if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
                return `$${v}`;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default RevenueChartCard;
