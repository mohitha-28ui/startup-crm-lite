import React from "react";

/**
 * RecentLeads component renders a table of the 5 most recently created leads.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.leads - Collection of lead records from the CRM context.
 * @param {number|string} props.leads[].id - Lead ID.
 * @param {string} props.leads[].name - Contact's full name.
 * @param {string} props.leads[].company - Associated company name.
 * @param {string} props.leads[].status - Lead status stage.
 * @param {string|number} [props.leads[].value] - Lead financial valuation.
 * @param {string} [props.leads[].dateAdded] - Date string when the lead was created.
 * @returns {React.JSX.Element} The rendered RecentLeads table card.
 */
function RecentLeads({ leads = [] }) {
  // Take the last 5 leads and reverse them to show the newest at the top
  const recentLeads = [...leads].slice(-5).reverse();

  /**
   * Helper to render status badges with distinct semantic theme styling.
   * @param {string} status - Status code.
   * @returns {React.JSX.Element} The badge component.
   */
  const renderStatusBadge = (status) => {
    const normalized = String(status || "").toLowerCase().trim();
    switch (normalized) {
      case "won":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            Won
          </span>
        );
      case "lost":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            Lost
          </span>
        );
      case "in progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            In Progress
          </span>
        );
      case "new":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            New
          </span>
        );
      case "contacted":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Contacted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            {status || "Unknown"}
          </span>
        );
    }
  };

  /**
   * Safe formatter for lead dateAdded metadata.
   * @param {Object} lead - Lead object.
   * @returns {string} Formatted date.
   */
  const formatDate = (lead) => {
    if (lead.dateAdded) return lead.dateAdded;
    if (lead.createdAt) return lead.createdAt;
    
    // Consistent mock fallbacks for core initial records
    if (lead.id === 1) return "Jun 14, 2026";
    if (lead.id === 2) return "Jun 15, 2026";
    if (lead.id === 3) return "Jun 15, 2026";
    if (lead.id === 4) return "Jun 16, 2026";

    // Format current date as fallback
    const d = new Date();
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recent Leads</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The last 5 pipeline additions requiring action
          </p>
        </div>
      </div>

      {recentLeads.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-sm text-slate-400 font-medium">No leads recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-1">Name</th>
                <th className="pb-3">Company</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-1">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentLeads.map((lead) => (
                <tr
                  key={lead.id || lead.name}
                  className="hover:bg-slate-50/70 transition-colors duration-150 group"
                >
                  <td className="py-3.5 pl-1 font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {lead.name}
                  </td>
                  <td className="py-3.5 text-slate-600 text-sm">
                    {lead.company}
                  </td>
                  <td className="py-3.5">
                    {renderStatusBadge(lead.status)}
                  </td>
                  <td className="py-3.5 text-right text-xs text-slate-400 pr-1">
                    {formatDate(lead)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentLeads;