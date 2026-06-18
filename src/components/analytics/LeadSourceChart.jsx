import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

/**
 * Custom Tooltip component for Lead Source Chart.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 text-xs font-semibold rounded-xl shadow-lg border border-slate-800">
        <p className="text-slate-300 font-bold">{data.source}</p>
        <p className="mt-1 font-semibold text-blue-400">{data.count} Leads</p>
      </div>
    );
  }
  return null;
};

/**
 * LeadSourceChart component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.data - Lead sources dataset from useAnalytics.
 * @returns {React.JSX.Element} The rendered LeadSourceChart component.
 */
export function LeadSourceChart({ data = [] }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200/60 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-slate-300/60 dark:hover:border-gray-700 transition-all duration-200 flex flex-col justify-between h-96">
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">Lead Sources</h3>
        <p className="text-xs text-slate-400 dark:text-gray-400 mt-0.5">Performance of acquisition channels</p>
      </div>

      <div className="h-64 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 500 }}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="source"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 600 }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="#3B82F6"
              radius={[0, 6, 6, 0]}
              animationDuration={800}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LeadSourceChart;
