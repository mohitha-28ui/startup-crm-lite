import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

/**
 * Custom Tooltip for Line Chart.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 text-xs font-semibold rounded-xl shadow-lg border border-slate-800">
        <p className="font-bold text-slate-350">{data.month}</p>
        <p className="mt-1 text-green-400 font-bold">Conversion Rate: {data.rate}%</p>
      </div>
    );
  }
  return null;
};

/**
 * LineChartCard component showing monthly lead conversion rate.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.data - Monthly conversion rate dataset.
 * @returns {React.JSX.Element} The rendered LineChartCard component.
 */
export function LineChartCard({ data = [] }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between h-96 transition-colors duration-200 [--line-dot-bg:#ffffff] dark:[--line-dot-bg:#111827]">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Conversion Rate Trend</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Monthly closed-won lead percentage timeline</p>
      </div>

      <div className="h-64 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 500 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 500 }}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#22C55E" // Success Green
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, stroke: "#22C55E", fill: "var(--line-dot-bg)" }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#22C55E" }}
              isAnimationActive={true}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LineChartCard;
