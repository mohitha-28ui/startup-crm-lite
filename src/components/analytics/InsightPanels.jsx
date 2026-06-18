import { Activity, Clock, DollarSign, Gauge, Target, Zap } from "lucide-react";
import { AnalyticsShell } from "./AnalyticsShell";

function MetricRow({ icon: Icon, label, value, helper }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-9 h-9 rounded-xl bg-white border border-slate-100 text-blue-600 flex items-center justify-center shrink-0">
          <Icon size={17} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{label}</p>
          <p className="text-xs text-slate-500 truncate">{helper}</p>
        </div>
      </div>
      <p className="text-sm font-extrabold text-slate-950 shrink-0">{value}</p>
    </div>
  );
}

export function SalesVelocityPanel({ analytics }) {
  const money = analytics.formatted.compactCurrency;

  return (
    <AnalyticsShell title="Sales Velocity" description="How quickly pipeline turns into revenue.">
      <div className="space-y-3">
        <MetricRow
          icon={Zap}
          label="Velocity"
          value={`${money(analytics.salesVelocity)}/day`}
          helper="Weighted by open pipeline and win rate"
        />
        <MetricRow
          icon={Clock}
          label="Sales Cycle"
          value={`${analytics.salesCycleDays} days`}
          helper="Estimated from lead activity range"
        />
        <MetricRow
          icon={DollarSign}
          label="Average Deal"
          value={money(analytics.averageDealSize)}
          helper="Based on won opportunities"
        />
        <MetricRow
          icon={Gauge}
          label="Pipeline Coverage"
          value={`${analytics.pipelineCoverage.toFixed(1)}x`}
          helper="Open pipeline compared with closed revenue"
        />
      </div>
    </AnalyticsShell>
  );
}

export function ActivityHeatmap({ data }) {
  const maxCount = Math.max(1, ...data.flatMap((row) => row.slots.map((slot) => slot.count)));
  const slotLabels = ["12a", "4a", "8a", "12p", "4p", "8p"];

  return (
    <AnalyticsShell title="Activity Heatmap" description="Lead creation intensity by day and time.">
      <div className="grid grid-cols-[44px_repeat(6,minmax(0,1fr))] gap-2 text-xs">
        <span />
        {slotLabels.map((label) => (
          <span key={label} className="text-center font-semibold text-slate-400">
            {label}
          </span>
        ))}
        {data.map((row) => (
          <div key={row.day} className="contents">
            <span className="font-semibold text-slate-500 flex items-center">{row.day}</span>
            {row.slots.map((slot) => {
              const opacity = 0.12 + (slot.count / maxCount) * 0.78;
              return (
                <div
                  key={`${row.day}-${slot.slot}`}
                  className="h-8 rounded-lg border border-blue-100"
                  style={{ backgroundColor: `rgba(37, 99, 235, ${opacity})` }}
                  title={`${row.day} ${slotLabels[slot.slot]}: ${slot.count} leads`}
                  aria-label={`${row.day} ${slotLabels[slot.slot]} ${slot.count} leads`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </AnalyticsShell>
  );
}

export function TeamProductivityTable({ data }) {
  return (
    <AnalyticsShell title="Team Productivity" description="Auto-attributed workload from lead ownership signals.">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
              <th className="pb-3">Owner</th>
              <th className="pb-3">Leads</th>
              <th className="pb-3">Won</th>
              <th className="pb-3">Revenue</th>
              <th className="pb-3 text-right">Win Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((member) => (
              <tr key={member.owner}>
                <td className="py-3 font-bold text-slate-800">{member.owner}</td>
                <td className="py-3 text-slate-600">{member.leads}</td>
                <td className="py-3 text-slate-600">{member.won}</td>
                <td className="py-3 text-slate-600">${member.revenue.toLocaleString("en-US")}</td>
                <td className="py-3 text-right">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 border border-green-100 px-2 py-1 text-xs font-bold">
                    <Target size={12} aria-hidden="true" />
                    {member.conversion}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnalyticsShell>
  );
}

export function ExecutiveSummary({ analytics }) {
  const money = analytics.formatted.compactCurrency;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-950 text-white rounded-2xl p-5">
        <div className="flex items-center gap-2 text-blue-200">
          <Activity size={17} aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-wide">Pipeline Health</span>
        </div>
        <p className="text-2xl font-extrabold mt-3">{money(analytics.totalPipeline)}</p>
        <p className="text-sm text-slate-300 mt-2">{analytics.openLeads} active deals across the funnel.</p>
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Next Month Forecast</p>
        <p className="text-2xl font-extrabold text-slate-950 mt-3">{money(analytics.nextMonthForecast)}</p>
        <p className="text-sm text-slate-500 mt-2">{money(analytics.weightedForecast)} confidence-weighted open pipeline.</p>
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Conversion Quality</p>
        <p className="text-2xl font-extrabold text-slate-950 mt-3">{analytics.conversionRate}%</p>
        <p className="text-sm text-slate-500 mt-2">Current win rate from all captured leads.</p>
      </div>
    </div>
  );
}
