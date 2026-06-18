import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { AnalyticsShell } from "./AnalyticsShell";

const axisStyle = { fontSize: 11, fill: "#64748b" };
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  notation: "compact",
});

function formatCurrency(value) {
  return currency.format(value || 0);
}

function ChartFrame({ children, label }) {
  return (
    <div className="h-72" role="img" aria-label={label} tabIndex={0}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueTrendChart({ data }) {
  return (
    <AnalyticsShell
      title="Revenue Growth"
      description="Monthly lead volume, closed revenue, and weighted forecast."
    >
      <ChartFrame label="Monthly revenue trend chart">
        <ComposedChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
          <Tooltip formatter={(value, name) => [name === "leads" ? value : formatCurrency(value), name]} />
          <Legend />
          <Bar dataKey="revenue" name="Closed revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
          <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#16a34a" strokeWidth={3} dot={false} />
          <Area type="monotone" dataKey="leads" name="Leads" fill="#dbeafe" stroke="#60a5fa" />
        </ComposedChart>
      </ChartFrame>
    </AnalyticsShell>
  );
}

export function FunnelChart({ data }) {
  return (
    <AnalyticsShell title="Funnel Analysis" description="Stage distribution and value concentration.">
      <ChartFrame label="Lead funnel by status">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 18, left: 18, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis dataKey="status" type="category" tick={axisStyle} axisLine={false} tickLine={false} width={118} />
          <Tooltip formatter={(value, name) => [name === "value" ? formatCurrency(value) : value, name]} />
          <Bar dataKey="leads" name="Leads" radius={[0, 8, 8, 0]}>
            {data.map((entry) => (
              <Cell key={entry.status} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartFrame>
    </AnalyticsShell>
  );
}

export function LeadSourceChart({ data }) {
  const palette = ["#2563eb", "#16a34a", "#7c3aed", "#d97706", "#0891b2", "#dc2626"];

  return (
    <AnalyticsShell title="Lead Source Analytics" description="Which channels create pipeline and wins.">
      <ChartFrame label="Lead source performance chart">
        <PieChart>
          <Pie data={data} dataKey="leads" nameKey="source" innerRadius={64} outerRadius={96} paddingAngle={3}>
            {data.map((entry, index) => (
              <Cell key={entry.source} fill={palette[index % palette.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name, props) => [value, props.payload.source]} />
          <Legend />
        </PieChart>
      </ChartFrame>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.slice(0, 4).map((source) => (
          <div key={source.source} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
            <span className="text-sm font-semibold text-slate-700">{source.source}</span>
            <span className="text-xs text-slate-500">{source.conversion}% win rate</span>
          </div>
        ))}
      </div>
    </AnalyticsShell>
  );
}

export function PipelineForecastChart({ data }) {
  return (
    <AnalyticsShell title="Forecasting" description="Weighted pipeline by stage probability.">
      <ChartFrame label="Pipeline forecast area chart">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Area type="monotone" dataKey="forecast" stroke="#16a34a" strokeWidth={3} fill="url(#forecastFill)" />
        </AreaChart>
      </ChartFrame>
    </AnalyticsShell>
  );
}
