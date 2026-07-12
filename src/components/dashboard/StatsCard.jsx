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
      bg: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30",
      text: "text-green-600 dark:text-green-400",
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
      text: "text-amber-600 dark:text-amber-400",
    },
    danger: {
      bg: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30",
      text: "text-red-600 dark:text-red-400",
    },
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-800 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400 tracking-wide uppercase">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
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
              ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30"
              : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30"
          }`}
        >
          {isPositive ? (
            <TrendingUp size={12} className="inline stroke-[2.5]" />
          ) : (
            <TrendingDown size={12} className="inline stroke-[2.5]" />
          )}
          {displayChange}
        </span>
        <span className="text-xs text-slate-400 dark:text-gray-500">vs last month</span>
      </div>
    </div>
  );
}

export default StatsCard;