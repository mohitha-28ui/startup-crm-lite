import { memo } from "react";
import { Pencil, Trash2, Mail, Phone, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";

/**
 * LeadCard component displays lead info in a grid card layout.
 * Redesigned with glassmorphic cards, gradient borders, and micro-hover lifts.
 */
function LeadCard({ lead, onEdit, onDelete }) {
  const getInitials = (name) => {
    if (typeof name !== "string" || !name.trim()) return "??";
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(lead);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(lead.id);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-5 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/40 dark:border-slate-800/30 group relative flex flex-col justify-between"
    >
      <div className="space-y-4">
        {/* Header section */}
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            {/* Initials Avatar */}
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-extrabold text-xs shadow-md shadow-blue-500/10 shrink-0 border border-white/10">
              {getInitials(lead.name)}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-950 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base">
                {lead.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <Briefcase size={11} className="text-slate-400 dark:text-slate-500 stroke-[2.25]" />
                <span className="truncate">{lead.company}</span>
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-850 p-0.5 rounded-lg border border-slate-200/40 dark:border-slate-800/40 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleEditClick}
              className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-900 text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors cursor-pointer"
              title="Edit Lead"
              aria-label={`Edit ${lead.name}`}
            >
              <Pencil size={13} className="stroke-[2.5]" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-900 text-slate-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-455 rounded-md transition-colors cursor-pointer"
              title="Delete Lead"
              aria-label={`Delete ${lead.name}`}
            >
              <Trash2 size={13} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Middle section (Status and deal value) */}
        <div className="flex items-center justify-between pt-1 pb-3 border-b border-slate-100 dark:border-slate-800/40">
          <StatusBadge status={lead.status} />
          {lead.value && (
            <span className="text-sm font-extrabold text-slate-950 dark:text-white bg-slate-100/50 dark:bg-slate-800/40 px-2 py-0.5 rounded-lg border border-slate-200/20 dark:border-slate-700/20">
              {lead.value}
            </span>
          )}
        </div>
      </div>

      {/* Footer details (Email & Phone) */}
      <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
        <a
          href={`mailto:${lead.email}`}
          className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Mail size={13} className="text-slate-400 dark:text-slate-500 stroke-[2.25]" />
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
          <div className="flex items-center gap-2 text-slate-350 dark:text-gray-600 font-medium">
            <Phone size={13} className="stroke-[2.25]" />
            <span className="italic">No phone registered</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default memo(LeadCard);
