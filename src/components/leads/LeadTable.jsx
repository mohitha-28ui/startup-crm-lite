import React from "react";
import { Pencil, Trash2, Mail, Phone, Calendar, ArrowUpRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

/**
 * LeadTable component displays a tabular list of leads for desktop displays.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.leads - Collection of lead records.
 * @param {function} props.onEdit - Callback function triggered to edit a lead.
 * @param {function} props.onDelete - Callback function triggered to delete a lead.
 * @returns {React.JSX.Element} The rendered LeadTable component.
 */
function LeadTable({ leads = [], onEdit, onDelete }) {
  /**
   * Safe formatter for lead dateAdded metadata.
   * @param {string} dateStr - Date string.
   * @returns {string} Formatted output.
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr; // Return raw string if custom format
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-200">
      {leads.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-gray-800/40">
          <p className="text-sm text-slate-400 dark:text-gray-500 font-medium">No leads currently in the list.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-gray-800 bg-slate-50/70 dark:bg-gray-800/50 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="py-4 pl-6">Contact Name</th>
                <th className="py-4">Company</th>
                <th className="py-4">Pipeline Status</th>
                <th className="py-4">Email Address</th>
                <th className="py-4 hidden lg:table-cell">Lead Source</th>
                <th className="py-4 hidden lg:table-cell">Date Added</th>
                <th className="py-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-gray-800 text-sm">
              {leads.map((lead) => (
                <tr
                  key={lead.id || lead.name}
                  className="hover:bg-slate-50/50 dark:hover:bg-gray-800/30 transition-colors duration-150 group"
                >
                  {/* Name */}
                  <td className="py-4 pl-6 font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-455 transition-colors">
                    {lead.name}
                  </td>
                  
                  {/* Company */}
                  <td className="py-4 text-slate-600 dark:text-gray-300">
                    {lead.company}
                  </td>
                  
                  {/* Status Badge */}
                  <td className="py-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  
                  {/* Email */}
                  <td className="py-4 text-slate-600 dark:text-gray-300">
                    <a
                      href={`mailto:${lead.email}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{lead.email}</span>
                      <Mail size={12} className="text-slate-350 dark:text-gray-500" />
                    </a>
                  </td>
                  
                  {/* Source */}
                  <td className="py-4 text-slate-500 dark:text-gray-400 font-medium hidden lg:table-cell">
                    {lead.source || "Website"}
                  </td>
                  
                  {/* Date Added */}
                  <td className="py-4 text-slate-400 dark:text-gray-500 text-xs hidden lg:table-cell">
                    {formatDate(lead.dateAdded)}
                  </td>
                  
                  {/* Action Buttons */}
                  <td className="py-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-600 dark:text-gray-350 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer"
                        title="Edit Lead"
                        aria-label={`Edit ${lead.name}`}
                      >
                        <Pencil size={15} className="stroke-[2.5]" />
                      </button>
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-600 dark:text-gray-350 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete Lead"
                        aria-label={`Delete ${lead.name}`}
                      >
                        <Trash2 size={15} className="stroke-[2.5]" />
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

export default LeadTable;
