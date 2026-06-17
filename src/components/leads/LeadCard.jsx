import React from "react";
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

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 group">
      {/* Header section */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          {/* Initials Avatar */}
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm border border-blue-100 shrink-0">
            {getInitials(lead.name)}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {lead.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <Briefcase size={12} className="text-slate-400" />
              <span>{lead.company}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(lead)}
            className="p-1.5 hover:bg-white text-slate-600 hover:text-blue-600 rounded-md transition-colors"
            title="Edit Lead"
            aria-label={`Edit ${lead.name}`}
          >
            <Pencil size={14} className="stroke-[2.5]" />
          </button>
          <button
            onClick={() => onDelete(lead.id)}
            className="p-1.5 hover:bg-white text-slate-600 hover:text-red-600 rounded-md transition-colors"
            title="Delete Lead"
            aria-label={`Delete ${lead.name}`}
          >
            <Trash2 size={14} className="stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Middle section (Status and deal value) */}
      <div className="flex items-center justify-between mt-4 pb-4 border-b border-slate-50">
        <StatusBadge status={lead.status} />
        {lead.value && (
          <span className="text-sm font-bold text-slate-950">
            {lead.value}
          </span>
        )}
      </div>

      {/* Footer details (Email & Phone) */}
      <div className="mt-4 space-y-2 text-xs text-slate-500">
        <a
          href={`mailto:${lead.email}`}
          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
        >
          <Mail size={13} className="text-slate-400 stroke-[2.25]" />
          <span className="truncate">{lead.email}</span>
        </a>
        
        {lead.phone ? (
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <Phone size={13} className="text-slate-400 stroke-[2.25]" />
            <span>{lead.phone}</span>
          </a>
        ) : (
          <div className="flex items-center gap-2 text-slate-350">
            <Phone size={13} className="stroke-[2.25]" />
            <span className="italic">No phone registered</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeadCard;
