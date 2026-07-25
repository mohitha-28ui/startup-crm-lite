import { UserPlus, Clock, Calendar, DollarSign, Trash2, Check, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Renders a specific notification item based on its type.
 */
function NotificationItem({ notification, onMarkAsRead }) {
  const { id, type, title, message, time, read } = notification;

  // Type-specific config
  const typeConfigs = {
    lead: {
      icon: UserPlus,
      bg: "bg-blue-50 dark:bg-blue-950/45 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30",
    },
    reminder: {
      icon: Clock,
      bg: "bg-amber-50 dark:bg-amber-950/45 text-amber-600 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/30",
    },
    meeting: {
      icon: Calendar,
      bg: "bg-purple-50 dark:bg-purple-950/45 text-purple-600 dark:text-purple-400 border border-purple-100/50 dark:border-purple-900/30",
    },
    revenue: {
      icon: DollarSign,
      bg: "bg-emerald-50 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30",
    },
  };

  const config = typeConfigs[type] || typeConfigs.lead;
  const Icon = config.icon;

  return (
    <div
      className={`group flex gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
        read
          ? "bg-transparent border-transparent text-slate-400 dark:text-gray-500"
          : "bg-slate-50/50 dark:bg-slate-850/40 border-slate-200/40 dark:border-slate-800/30 text-slate-800 dark:text-gray-200"
      }`}
    >
      <div className={`p-2 rounded-xl h-10 w-10 flex items-center justify-center shrink-0 ${config.bg}`}>
        <Icon size={16} className="stroke-[2.25]" />
      </div>

      <div className="flex-1 space-y-0.5 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className={`text-xs font-bold truncate ${!read && "text-slate-905 dark:text-white"}`}>
            {title}
          </h4>
          <span className="text-[9px] font-bold text-slate-400 dark:text-gray-550 whitespace-nowrap mt-0.5">
            {time}
          </span>
        </div>
        <p className="text-[11px] leading-relaxed line-clamp-2 pr-4">{message}</p>
      </div>

      {!read && (
        <button
          onClick={() => onMarkAsRead(id)}
          type="button"
          aria-label="Mark as read"
          className="self-center p-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg border border-slate-200/60 dark:border-slate-800 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 cursor-pointer shadow-sm"
          title="Mark as read"
        >
          <Check size={12} className="stroke-[3]" />
        </button>
      )}
    </div>
  );
}

/**
 * Dropdown popover displaying lists of recent notifications.
 */
export function NotificationDropdown({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onClose,
}) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 mt-3.5 w-[330px] sm:w-[370px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/40 shadow-2xl rounded-2xl z-45 overflow-hidden flex flex-col max-h-[460px]"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/30 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/45 shrink-0">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
              {unreadCount} New
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              type="button"
              className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-0.5"
            >
              <CheckCheck size={12} className="stroke-[2.5]" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              type="button"
              className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-0.5"
            >
              <Trash2 size={12} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Notifications List body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <NotificationItem key={item.id} notification={item} onMarkAsRead={onMarkAsRead} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-3">
            <div className="h-10 w-10 bg-slate-100 dark:bg-slate-850 border border-slate-200/40 dark:border-slate-800/30 text-slate-400 dark:text-slate-500 rounded-xl flex items-center justify-center shadow-sm select-none">
              <CheckCheck size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-850 dark:text-white">All caught up!</p>
              <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5 font-semibold">No new notifications to review.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-slate-200/40 dark:border-slate-800/30 p-2 bg-slate-50/30 dark:bg-slate-900/30 text-center shrink-0">
          <button
            onClick={onClose}
            type="button"
            className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-gray-250 transition-colors w-full cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default NotificationDropdown;
