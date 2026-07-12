import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  New: "#94A3B8",
  Contacted: "#2563EB",
  Meeting: "#F59E0B",
  Proposal: "#7C3AED",
  Won: "#22C55E",
  Lost: "#EF4444",
};

/**
 * Custom Tooltip to display exact status numbers and percentages.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 text-xs font-semibold rounded-xl shadow-lg border border-slate-800">
        <p className="font-bold text-slate-350">{data.name}</p>
        <p className="mt-1">{data.value} Leads</p>
        <p className="text-blue-400">{data.percentage}%</p>
      </div>
    );
  }
  return null;
};

/**
 * PieChartCard component showing status distribution.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.data - Status distribution data array.
 * @returns {React.JSX.Element} The rendered PieChartCard component.
 */
export function PieChartCard({ data = [] }) {
  const totalLeads = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between h-96 transition-colors duration-200">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Lead Status Distribution</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Breakdown of leads by sales pipeline status</p>
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
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                isAnimationActive={true}
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || "#CBD5E1"} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute text-center pointer-events-none flex flex-col justify-center items-center">
            <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">
              {totalLeads}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mt-1">
              Leads
            </span>
          </div>
        </div>

        {/* Legend Panel */}
        <div className="w-full sm:w-1/2 flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
          {data.map((item) => {
            const color = COLORS[item.name] || "#CBD5E1";
            return (
              <div key={item.name} className="flex justify-between items-center text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-slate-700 dark:text-gray-300 font-semibold">{item.name}</span>
                </div>
                <span className="text-slate-500 dark:text-gray-400 font-medium">
                  {item.value} <span className="text-slate-400 dark:text-gray-500 font-normal">({item.percentage}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PieChartCard;
