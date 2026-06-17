import React from "react";

/**
 * StatusBadge component displays a pill-shaped colored badge corresponding to the lead status.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.status - The lead's pipeline status stage (e.g. "New", "Won", "Lost").
 * @returns {React.JSX.Element} The rendered StatusBadge component.
 */
function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase().trim();

  // Define style configuration for each status choice
  const configMap = {
    new: {
      label: "New",
      classes: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-850 dark:text-slate-300 dark:border-slate-800",
    },
    contacted: {
      label: "Contacted",
      classes: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30",
    },
    "meeting scheduled": {
      label: "Meeting Scheduled",
      classes: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/30",
    },
    "proposal sent": {
      label: "Proposal Sent",
      classes: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
    },
    won: {
      label: "Won",
      classes: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/30",
    },
    lost: {
      label: "Lost",
      classes: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30",
    },
  };

  const selected = configMap[normalized] || {
    label: status || "Unknown",
    classes: "bg-slate-50 text-slate-600 border-slate-100",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${selected.classes}`}
    >
      {selected.label}
    </span>
  );
}

export default StatusBadge;
