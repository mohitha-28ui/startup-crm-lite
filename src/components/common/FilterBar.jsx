
const FILTERS = ["All", "New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"];

/**
 * FilterBar component displays clickable status filter buttons with lead counts.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.activeFilter - Currently active filter value.
 * @param {function} props.onFilterChange - Callback when a filter is selected.
 * @param {Array<Object>} props.leads - Full leads list for count calculation.
 * @returns {React.JSX.Element} The rendered FilterBar component.
 */
function FilterBar({ activeFilter, onFilterChange, leads = [] }) {
  const getCount = (filter) => {
    if (filter === "All") return leads.length;
    return leads.filter((lead) => lead.status === filter).length;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter;
        const count = getCount(filter);

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            aria-pressed={isActive}
            className={`px-3.5 py-2 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {filter} ({count})
          </button>
        );
      })}
    </div>
  );
}

export default FilterBar;
