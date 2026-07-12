import { memo } from "react";
import { Pencil, Trash2, Mail, Phone, Briefcase } from "lucide-react";
import StatusBadge from "./StatusBadge";

/**
 * LeadCard component displays lead info in a grid card layout.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.lead - The lead data object.
 * @param {string|number} props.lead.id - Lead ID.
 * @param {string} props.lead.name - Name of the lead contact.
 * @param {string} props.lead.company - Associated company name.
 * @param {string} props.lead.email - Email address.
 * @param {string} [props.lead.phone] - Phone number.
 * @param {string} props.lead.status - Stage in pipeline.
 * @param {string|number} [props.lead.value] - Monetary value of the deal.
 * @param {function} props.onEdit - Callback function triggered to edit this lead.
 * @param {function} props.onDelete - Callback function triggered to delete this lead.
 * @returns {React.JSX.Element} The rendered LeadCard component.
 */
function LeadCard({ lead, onEdit, onDelete }) {
  /**
   * Generates initials from the lead's name for the avatar badge.
   * @param {string} name - Lead contact name.
   * @returns {string} Initials string.
   */
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEditClick = () => {
    onEdit(lead);
  };

  const handleDeleteClick = () => {
    onDelete(lead.id);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 group">
      {/* Header section */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          {/* Initials Avatar */}
          <div className="w-11 h-11 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold text-sm border border-blue-100 dark:border-blue-800 shrink-0">
            {getInitials(lead.name)}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {lead.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              <Briefcase size={12} className="text-slate-400 dark:text-gray-500" />
              <span>{lead.company}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 bg-slate-50 dark:bg-gray-850 p-0.5 rounded-xl border border-slate-100 dark:border-gray-800 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleEditClick}
            className="w-11 h-11 flex items-center justify-center hover:bg-white dark:hover:bg-gray-900 text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer"
            title="Edit Lead"
            aria-label={`Edit ${lead.name}`}
          >
            <Pencil size={16} className="stroke-[2.5]" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="w-11 h-11 flex items-center justify-center hover:bg-white dark:hover:bg-gray-900 text-slate-600 dark:text-gray-350 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
            title="Delete Lead"
            aria-label={`Delete ${lead.name}`}
          >
            <Trash2 size={16} className="stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Middle section (Status and deal value) */}
      <div className="flex items-center justify-between mt-4 pb-4 border-b border-slate-50 dark:border-gray-800/80">
        <StatusBadge status={lead.status} />
        {lead.value && (
          <span className="text-sm font-bold text-slate-950 dark:text-white">
            {lead.value}
          </span>
        )}
      </div>

      {/* Footer details (Email & Phone) */}
      <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-gray-400">
        <a
          href={`mailto:${lead.email}`}
          className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Mail size={13} className="text-slate-400 dark:text-gray-500 stroke-[2.25]" />
          <span className="truncate">{lead.email}</span>
        </a>
        
        {lead.phone ? (
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Phone size={13} className="text-slate-400 dark:text-gray-500 stroke-[2.25]" />
            <span>{lead.phone}</span>
          </a>
        ) : (
          <div className="flex items-center gap-2 text-slate-350 dark:text-gray-600">
            <Phone size={13} className="stroke-[2.25]" />
            <span className="italic">No phone registered</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(LeadCard);
