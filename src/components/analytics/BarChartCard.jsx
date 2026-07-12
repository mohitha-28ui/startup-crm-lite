import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

/**
 * Custom Tooltip for Bar Chart.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 text-xs font-semibold rounded-xl shadow-lg border border-slate-800">
        <p className="font-bold text-slate-350">{data.month}</p>
        <p className="mt-1 font-semibold text-blue-400">{data.count} Leads</p>
      </div>
    );
  }
  return null;
};

/**
 * BarChartCard component showing monthly lead generation trends.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.data - Monthly lead count dataset.
 * @returns {React.JSX.Element} The rendered BarChartCard component.
 */
export function BarChartCard({ data = [] }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between h-96 transition-colors duration-200">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Leads</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Lead acquisition volumes for the last 6 months</p>
      </div>

      <div className="h-64 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.1)" }} />
            <Bar
              dataKey="count"
              fill="#2563EB" // Primary Blue
              radius={[6, 6, 0, 0]}
              isAnimationActive={true}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BarChartCard;
