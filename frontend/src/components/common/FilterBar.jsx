import { motion } from "framer-motion";

const FILTERS = ["All", "New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"];

/**
 * FilterBar component displays status filters with active counts.
 * Uses Framer Motion's layout animations for smooth sliding indicator pills.
 */
function FilterBar({ activeFilter, onFilterChange, leads = [] }) {
  const getCount = (filter) => {
    if (filter === "All") return leads.length;
    return leads.filter((lead) => lead.status === filter).length;
  };

  return (
    <div className="flex flex-wrap gap-2 relative">
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter;
        const count = getCount(filter);

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            aria-pressed={isActive}
            className={`relative px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer overflow-hidden border border-transparent select-none ${
              isActive
                ? "text-white"
                : "bg-slate-100/50 dark:bg-slate-850/40 text-slate-655 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-150/60 dark:hover:bg-slate-800/40"
            }`}
          >
            {/* Sliding Active Pill */}
            {isActive && (
              <motion.div
                layoutId="activeFilterBg"
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-650 -z-10 shadow-[0_3px_10px_rgba(37,99,235,0.25)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {filter} <span className={`text-[10px] font-semibold ml-0.5 ${isActive ? "text-blue-100" : "text-slate-400 dark:text-slate-500"}`}>({count})</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default FilterBar;
