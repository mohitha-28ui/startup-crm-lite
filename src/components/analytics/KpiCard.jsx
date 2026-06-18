import { ArrowUpRight } from "lucide-react";

const toneClasses = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  green: "bg-green-50 text-green-700 border-green-100",
  violet: "bg-violet-50 text-violet-700 border-violet-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
};

export function KpiCard({ label, value, helper, trend, icon: Icon, tone = "blue" }) {
  return (
    <article className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-extrabold text-slate-950 mt-2">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${toneClasses[tone]}`}>
          <Icon size={19} aria-hidden="true" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 mt-4">
        <p className="text-xs text-slate-500 truncate">{helper}</p>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-1">
          <ArrowUpRight size={12} aria-hidden="true" />
          {trend}
        </span>
      </div>
    </article>
  );
}
