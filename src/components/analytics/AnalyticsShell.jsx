import { BarChart3 } from "lucide-react";

export function AnalyticsShell({ children, title, description, action }) {
  return (
    <section className="bg-white border border-slate-100 rounded-2xl shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-slate-900">
            <BarChart3 size={18} className="text-blue-600" aria-hidden="true" />
            <h2 className="text-base font-bold truncate">{title}</h2>
          </div>
          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function EmptyAnalyticsState() {
  return (
    <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
        <BarChart3 size={22} aria-hidden="true" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 mt-4">No analytics data yet</h2>
      <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
        Add a few leads with deal values and statuses to unlock conversion, revenue, source, and forecasting insights.
      </p>
    </div>
  );
}

export function LoadingAnalyticsState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" aria-live="polite">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm animate-pulse">
          <div className="h-4 w-24 bg-slate-100 rounded" />
          <div className="h-8 w-32 bg-slate-100 rounded mt-4" />
          <div className="h-3 w-40 bg-slate-100 rounded mt-4" />
        </div>
      ))}
    </div>
  );
}
