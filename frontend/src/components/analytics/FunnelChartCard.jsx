import { FunnelChart, Funnel, Cell, ResponsiveContainer, Tooltip, LabelList } from "recharts";
import { STATUS_COLORS } from "../../constants/analyticsColors";

/**
 * Custom Tooltip component for Funnel Chart.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 text-xs font-semibold rounded-xl shadow-lg border border-slate-800">
        <p className="text-slate-300 font-bold">{data.stage} Stage</p>
        <p className="mt-1">{data.value} Leads</p>
        <p className="text-green-400">Conversion: {data.pct}%</p>
        {data.stage !== "New" && (
          <p className="text-rose-400">Drop-off: {data.drop}%</p>
        )}
      </div>
    );
  }
  return null;
};

/**
 * FunnelChartCard component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.data - Funnel stage dataset from useAnalytics.
 * @returns {React.JSX.Element} The rendered FunnelChartCard component.
 */
export function FunnelChartCard({ data = [] }) {
  // Map statuses correctly to STATUS_COLORS (handling Meeting/Proposal short forms)
  const getStageColor = (stage) => {
    if (stage === "Meeting") return STATUS_COLORS.Meeting;
    if (stage === "Proposal") return STATUS_COLORS.Proposal;
    return STATUS_COLORS[stage] || "#CBD5E1";
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200/60 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-slate-300/60 dark:hover:border-gray-700 transition-all duration-200 flex flex-col justify-between h-96">
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">Sales Funnel</h3>
        <p className="text-xs text-slate-400 dark:text-gray-400 mt-0.5">Pipeline stage conversion and drop-off analysis</p>
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
                  <Cell key={`cell-${entry.stage}`} fill={getStageColor(entry.stage)} />
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
              <div key={item.stage} className="flex flex-col border border-slate-100 dark:border-gray-800 p-2.5 rounded-xl bg-slate-50/50 dark:bg-gray-800/40">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-slate-700 dark:text-gray-300">{item.stage}</span>
                  </div>
                  <span className="text-slate-800 dark:text-white">{item.value} Leads</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-gray-500 mt-1 font-medium">
                  <span>Conv: {item.pct}%</span>
                  {item.stage !== "New" && (
                    <span className="text-red-500 dark:text-red-400 font-semibold">Drop: {item.drop}%</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FunnelChartCard;
