import { useAuth } from "../../context/AuthContext";
import { useLeads } from "../../context/LeadContext";
import { Sparkles, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Premium glassmorphic Hero Banner section for the CRM Dashboard.
 * Displays dynamic time-based greetings, motivational quotes, and a quick performance summary.
 */
function HeroSection() {
  const { user } = useAuth();
  const { leads = [] } = useLeads();

  const firstName =
    user && typeof user.name === "string" && user.name.trim()
      ? user.name.split(" ")[0]
      : "Sana";

  // Calculate CRM Performance metrics
  const today = new Date().toDateString();
  const leadsCreatedToday = leads.filter(
    (lead) => new Date(lead.createdAt).toDateString() === today
  ).length;

  const totalLeads = leads.length;
  const wonLeads = leads.filter(
    (lead) => String(lead.status || "").toLowerCase() === "won"
  ).length;
  const conversionRate =
    totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  // Determine dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Curated motivational quote list
  const QUOTES = [
    "“The best way to predict the future is to create it.” — Peter Drucker",
    "“Focus on being productive instead of busy.” — Tim Ferriss",
    "“Opportunities don't happen. You create them.” — Chris Grosser",
    "“Action is the foundational key to all success.” — Pablo Picasso",
    "“Done is better than perfect.” — Sheryl Sandberg"
  ];
  // Select quote based on calendar day
  const dailyQuote = QUOTES[new Date().getDate() % QUOTES.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white p-6 sm:p-8 rounded-[24px] shadow-lg flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
    >
      {/* Decorative floating shapes */}
      <div className="absolute top-[-20%] right-[-10%] w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none animate-pulse duration-5000"></div>
      <div className="absolute bottom-[-30%] left-[10%] w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none animate-bounce duration-[12000ms]"></div>
      
      <div className="space-y-4 max-w-2xl relative z-10">
        <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-white/10">
          <Sparkles size={12} className="text-yellow-300 animate-spin duration-3000" />
          <span>Startup CRM Active</span>
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          {getGreeting()}, {firstName}!
        </h1>

        <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-lg">
          Your pipeline is performing beautifully. You have captured{" "}
          <span className="font-bold text-white underline decoration-cyan-300 decoration-2 underline-offset-4">
            {leadsCreatedToday > 0 ? `${leadsCreatedToday} new` : "new"}
          </span>{" "}
          leads today. Let's close some deals!
        </p>

        <p className="text-xs text-indigo-200/90 italic font-medium pt-1">
          {dailyQuote}
        </p>
      </div>

      {/* CRM Performance Summary Glassmorphic Card */}
      <div className="w-full lg:w-80 bg-white/10 dark:bg-slate-950/20 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/10 p-5 space-y-4 shadow-xl shrink-0 relative z-10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-200">
          CRM Performance Summary
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-blue-200 font-semibold uppercase">Total Leads</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold">{totalLeads}</span>
              <TrendingUp size={14} className="text-emerald-400" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-blue-200 font-semibold uppercase">Win Rate</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold">{conversionRate}%</span>
              <Award size={14} className="text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-blue-100 font-medium">
          <span>Active Leads In Progress:</span>
          <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">
            {leads.filter((l) => !["Won", "Lost"].includes(l.status)).length}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default HeroSection;