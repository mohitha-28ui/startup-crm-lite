import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

/**
 * Format helper for Indian Rupees localized formatting.
 */
function formatINR(val) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
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
      <div className="bg-slate-900 text-white p-3 text-xs font-semibold rounded-xl shadow-lg border border-slate-800">
        <p className="text-slate-300 font-bold">{data.month} Revenue</p>
        <p className="mt-1 text-emerald-400 font-bold">{formatINR(data.revenue)}</p>
      </div>
    );
  }
  return null;
};

/**
 * RevenueChartCard component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.data - Monthly revenue stats dataset from useAnalytics.
 * @returns {React.JSX.Element} The rendered RevenueChartCard component.
 */
export function RevenueChartCard({ data = [] }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200/60 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-slate-300/60 dark:hover:border-gray-700 transition-all duration-200 flex flex-col justify-between h-96">
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">Won Revenue History</h3>
        <p className="text-xs text-slate-400 dark:text-gray-400 mt-0.5">Total closed-won deal values by month</p>
      </div>

      <div className="h-64 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--nordic-success)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--nordic-success)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--nordic-text-secondary)", fontSize: 11, fontWeight: 500 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--nordic-text-secondary)", fontSize: 11, fontWeight: 500 }}
              tickFormatter={(v) => {
                if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
                if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
                if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
                return `₹${v}`;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--nordic-success)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChartCard;
