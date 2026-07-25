import { Calendar as CalendarIcon, Clock, User, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

/**
 * CalendarWidget component renders upcoming CRM meetings and client appointments.
 * Reads real meetings from active leads and combines them with system sync slots.
 */
function CalendarWidget({ leads = [] }) {
  // Extract leads that have meetingAt dates
  const scheduledLeads = leads
    .filter((lead) => lead.meetingAt)
    .map((lead) => ({
      id: lead.id,
      title: `Meeting with ${lead.name}`,
      subtitle: lead.company || "No Company",
      time: new Date(lead.meetingAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      date: new Date(lead.meetingAt),
      type: "client",
    }));

  // Standard mock sync slots for a fully populated premium CRM dashboard look
  const defaultEvents = [
    {
      id: "sync-1",
      title: "Design System Review",
      subtitle: "Internal Sync with Frontend team",
      time: "10:30 AM",
      date: new Date(),
      type: "internal",
    },
    {
      id: "sync-2",
      title: "CRM Feature Alignment",
      subtitle: "Product Roadmap Alignment",
      time: "2:00 PM",
      date: new Date(),
      type: "alignment",
    },
  ];

  // Combine and sort events
  const allEvents = [...scheduledLeads, ...defaultEvents].sort(
    (a, b) => a.date - b.date
  );

  const getBadgeStyle = (type) => {
    switch (type) {
      case "client":
        return "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30";
      case "internal":
        return "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30";
      default:
        return "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200/30 dark:border-slate-700/30";
    }
  };

  return (
    <div className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[20px] shadow-md border border-slate-200/40 dark:border-slate-800/30 flex flex-col justify-between h-full">
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <CalendarIcon size={18} className="stroke-[2.25]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Events</h3>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Today's Schedule</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/30">
            {allEvents.length} Events
          </span>
        </div>

        <div className="space-y-3.5 max-h-[260px] overflow-y-auto pr-1">
          {allEvents.map((event, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              key={event.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors border border-transparent hover:border-slate-200/30 dark:hover:border-slate-700/20 group"
            >
              <div className="flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-850/60 border border-slate-200/40 dark:border-slate-700/30 rounded-lg p-2 w-11 h-11 shrink-0">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {event.time.split(" ")[1] || "PM"}
                </span>
                <span className="text-sm font-extrabold text-slate-800 dark:text-white leading-none mt-0.5">
                  {event.time.split(":")[0]}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {event.title}
                  </h4>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ${getBadgeStyle(event.type)}`}>
                    {event.type}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-gray-400 truncate mt-1 flex items-center gap-1">
                  <User size={10} className="text-slate-400" />
                  <span>{event.subtitle}</span>
                </p>
                <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                  <Clock size={10} className="text-slate-400" />
                  <span>{event.time}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarWidget;
