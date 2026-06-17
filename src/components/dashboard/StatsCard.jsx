import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * StatsCard component displays a metric with an icon, value, and comparative change.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.title - The title label of the metric card.
 * @param {string|number} props.value - The main metric value to display.
 * @param {React.ComponentType<any>} props.icon - The Lucide React icon component.
 * @param {string|number} props.change - The percentage change vs last month (e.g. "+12.5%" or "-2.3%").
 * @param {'primary'|'success'|'warning'|'danger'} props.color - The visual theme color category for the icon.
 * @returns {React.JSX.Element} The rendered StatsCard component.
 */
function StatsCard({ title, value, icon: IconComponent, change, color = "primary" }) {
  const isPositive = typeof change === "number" ? change >= 0 : !String(change).startsWith("-");
  const displayChange = typeof change === "number" && change >= 0 ? `+${change}%` : String(change);

  // Mapping semantic color categories to tailwind colors using brand tokens
  const colorMap = {
    primary: {
      bg: "bg-blue-50 text-blue-600 border-blue-100",
      text: "text-blue-600",
    },
    success: {
      bg: "bg-green-50 text-green-600 border-green-100",
      text: "text-green-600",
    },
    warning: {
      bg: "bg-amber-50 text-amber-600 border-amber-100",
      text: "text-amber-600",
    },
    danger: {
      bg: "bg-red-50 text-red-600 border-red-100",
      text: "text-red-600",
    },
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>

        {IconComponent && (
          <div className={`p-3 rounded-xl border ${selectedColor.bg} flex items-center justify-center shadow-sm`}>
            <IconComponent size={22} className="stroke-[2.25]" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 mt-4">
        <span
          className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isPositive
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {isPositive ? (
            <TrendingUp size={12} className="inline stroke-[2.5]" />
          ) : (
            <TrendingDown size={12} className="inline stroke-[2.5]" />
          )}
          {displayChange}
        </span>
        <span className="text-xs text-slate-400">vs last month</span>
      </div>
    </div>
  );
}

export default StatsCard;