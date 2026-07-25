import { memo } from "react";
import { Pencil, Trash2, Mail, ExternalLink } from "lucide-react";
import StatusBadge from "./StatusBadge";

/**
 * LeadTable component displays a tabular list of leads for desktop displays.
 * Redesigned with premium sticky headers, blur filters, row highlights, and contact avatars.
 */
function LeadTable({ leads = [], onEdit, onDelete }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getInitials = (name) => {
    if (typeof name !== "string" || !name.trim()) return "?";
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-[20px] border border-slate-200/40 dark:border-slate-800/30 shadow-sm overflow-hidden transition-all duration-300">
      {leads.length === 0 ? (
        <div className="text-center py-14 bg-slate-50 dark:bg-slate-900/20">
          <p className="text-sm text-slate-400 dark:text-gray-500 font-medium">No leads currently in the list.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/40 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-850/30 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none sticky top-0 backdrop-blur-md z-10">
                <th className="py-4 pl-6">Contact Name</th>
                <th className="py-4">Company</th>
                <th className="py-4">Pipeline Status</th>
                <th className="py-4">Email Address</th>
                <th className="py-4 hidden lg:table-cell">Lead Source</th>
                <th className="py-4 hidden lg:table-cell">Date Added</th>
                <th className="py-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs sm:text-sm">
              {leads.map((lead) => (
                <tr
                  key={lead.id || lead.name}
                  className="hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-colors duration-150 group"
                >
                  {/* Name with initials avatar */}
                  <td className="py-3.5 pl-6 font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center font-extrabold text-[10px] shadow-sm shrink-0 border border-white/10 select-none">
                        {getInitials(lead.name)}
                      </div>
                      <span className="font-bold">{lead.name}</span>
                    </div>
                  </td>
                  
                  {/* Company */}
                  <td className="py-3.5 text-slate-600 dark:text-slate-350 font-medium">
                    {lead.company}
                  </td>
                  
                  {/* Status Badge */}
                  <td className="py-3.5">
                    <StatusBadge status={lead.status} />
                  </td>
                  
                  {/* Email */}
                  <td className="py-3.5 text-slate-600 dark:text-slate-300">
                    <a
                      href={`mailto:${lead.email}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors font-medium"
                    >
                      <span>{lead.email}</span>
                      <Mail size={12} className="text-slate-400 dark:text-slate-500" />
                    </a>
                  </td>
                  
                  {/* Source */}
                  <td className="py-3.5 text-slate-500 dark:text-slate-400 font-semibold hidden lg:table-cell">
                    <span className="bg-slate-100/60 dark:bg-slate-800/40 px-2 py-0.5 rounded-md border border-slate-200/20 dark:border-slate-700/20">
                      {lead.source || "Website"}
                    </span>
                  </td>
                  
                  {/* Date Added */}
                  <td className="py-3.5 text-slate-400 dark:text-slate-500 text-xs hidden lg:table-cell font-semibold">
                    {formatDate(lead.createdAt || lead.dateAdded)}
                  </td>
                  
                  {/* Action Buttons */}
                  <td className="py-3.5 text-right pr-6">
                    <div className="flex items-center justify-end gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => onEdit(lead)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer"
                        title="Edit Lead"
                        aria-label={`Edit ${lead.name}`}
                      >
                        <Pencil size={14} className="stroke-[2.5]" />
                      </button>
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 dark:hover:text-rose-455 rounded-lg transition-colors cursor-pointer"
                        title="Delete Lead"
                        aria-label={`Delete ${lead.name}`}
                      >
                        <Trash2 size={14} className="stroke-[2.5]" />
                      </button>
                    </div>
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

export default memo(LeadTable);
