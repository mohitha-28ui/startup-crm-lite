import { BarChart3, Plus } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * EmptyAnalyticsState component displayed when there is no lead data available in CRM.
 *
 * @component
 * @returns {React.JSX.Element} The rendered EmptyAnalyticsState component.
 */
export function EmptyAnalyticsState() {
  return (
    <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-slate-200/60 shadow-sm text-center max-w-lg mx-auto mt-12">
      <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-4 animate-bounce">
        <BarChart3 size={40} className="stroke-[1.5]" />
      </div>
      <h3 className="font-bold text-slate-900 text-xl tracking-tight">
        No analytics available yet
      </h3>
      <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">
        Add your first lead to start tracking pipeline health, conversion metrics, and business growth.
      </p>
      <Link
        to="/leads"
        className="mt-6 flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
      >
        <Plus size={16} className="stroke-[2.5]" />
        <span>Add Lead</span>
      </Link>
    </div>
  );
}

export default EmptyAnalyticsState;
