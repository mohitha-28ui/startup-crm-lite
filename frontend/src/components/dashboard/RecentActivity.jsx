import { CheckCircle2, UserPlus, Calendar, Award, FileText, Activity } from "lucide-react";
import { motion } from "framer-motion";

/**
 * RecentActivity timeline widget.
 * Lists actual activity events derived from lead changes (Won status, Meetings, additions)
 * and outputs them in a vertical timeline format.
 */
function RecentActivity({ leads = [] }) {
  // 1. Generate activity items from actual leads list
  const activities = [];

  leads.forEach((lead) => {
    const rawDate = lead.createdAt || lead.dateAdded;
    const leadName = lead.name || "Unknown Lead";
    const compName = lead.company ? ` (${lead.company})` : "";

    // Activity: Lead Added
    if (rawDate) {
      activities.push({
        id: `add-${lead.id}`,
        title: "Lead Registered",
        desc: `${leadName}${compName} added to CRM pipeline.`,
        date: new Date(rawDate),
        icon: UserPlus,
        color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30",
      });
    }

    // Activity: Meeting Scheduled
    if (lead.meetingAt) {
      activities.push({
        id: `meet-${lead.id}`,
        title: "Meeting Scheduled",
        desc: `Sync booked with ${leadName} regarding opportunities.`,
        date: new Date(lead.meetingAt),
        icon: Calendar,
        color: "text-purple-500 bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/30",
      });
    }

    // Activity: Proposal Sent
    if (["Proposal Sent", "Proposal"].includes(lead.status)) {
      activities.push({
        id: `prop-${lead.id}`,
        title: "Proposal Dispatched",
        desc: `Financial quote and timeline proposal sent to ${leadName}.`,
        date: rawDate ? new Date(rawDate) : new Date(),
        icon: FileText,
        color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/30",
      });
    }

    // Activity: Deal Won
    if (String(lead.status).toLowerCase() === "won") {
      activities.push({
        id: `won-${lead.id}`,
        title: "Deal Closed-Won",
        desc: `Lead ${leadName} converted. Deal successfully won!`,
        date: lead.wonAt ? new Date(lead.wonAt) : (rawDate ? new Date(rawDate) : new Date()),
        icon: Award,
        color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30",
      });
    }
  });

  // Sort activities by date desc and limit to top 4 for neat presentation
  const sortedActivities = activities
    .sort((a, b) => b.date - a.date)
    .slice(0, 4);

  // Fallback default activities if empty
  if (sortedActivities.length === 0) {
    sortedActivities.push(
      {
        id: "mock-1",
        title: "CRM Initialized",
        desc: "CRM Lite instance successfully synchronized.",
        date: new Date(),
        icon: CheckCircle2,
        color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30",
      }
    );
  }

  const formatRelativeTime = (date) => {
    try {
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.round(diffMs / (1000 * 60));
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[20px] shadow-md border border-slate-200/40 dark:border-slate-800/30 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Activity size={18} className="stroke-[2.25]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Timeline log</p>
            </div>
          </div>
        </div>

        {/* Timeline Log List */}
        <div className="relative pl-4 space-y-5 py-2 before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800/60 pr-1">
          {sortedActivities.map((act, idx) => {
            const Icon = act.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                key={act.id}
                className="flex items-start gap-4 relative"
              >
                {/* Timeline node icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 z-10 ${act.color}`}>
                  <Icon size={15} className="stroke-[2.25]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {act.title}
                    </h4>
                    <span className="text-[9px] font-bold text-slate-400 shrink-0">
                      {formatRelativeTime(act.date)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1 leading-normal">
                    {act.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RecentActivity;
