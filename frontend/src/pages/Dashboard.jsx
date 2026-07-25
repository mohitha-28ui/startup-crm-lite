import { useLeads } from "../context/LeadContext";
import { motion } from "framer-motion";

// Import layout / sub-dashboard components
import HeroSection from "../components/dashboard/HeroSection";
import StatsCard from "../components/dashboard/StatsCard";
import PipelineOverview from "../components/dashboard/PipelineOverview";
import RecentLeads from "../components/dashboard/RecentLeads";
import QuickActions from "../components/dashboard/QuickActions";

// Import new premium widgets
import CalendarWidget from "../components/dashboard/CalendarWidget";
import PerformanceWidget from "../components/dashboard/PerformanceWidget";
import RecentActivity from "../components/dashboard/RecentActivity";

// Import Lucide React icons
import { Users, Award, XCircle, Target, DollarSign, Briefcase } from "lucide-react";

/**
 * World-Class Redesigned Premium CRM Dashboard Page.
 * Visual layout and animations powered by Framer Motion.
 */
function Dashboard() {
  const { leads = [] } = useLeads();

  // 1. Calculate values for the 6 premium KPI metrics
  const totalLeads = leads.length;

  const wonLeads = leads.filter(
    (lead) => String(lead.status || "").toLowerCase() === "won"
  ).length;

  const lostLeads = leads.filter(
    (lead) => String(lead.status || "").toLowerCase() === "lost"
  ).length;

  const conversionRate =
    totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  // Calculate revenue: Sum of Won lead values
  const wonRevenue = leads
    .filter((lead) => String(lead.status || "").toLowerCase() === "won")
    .reduce((sum, lead) => {
      const val = parseFloat(String(lead.value || "0").replace(/[^0-9.]/g, "")) || 0;
      return sum + val;
    }, 0);

  // Calculate active deals in pipeline (excluding Won and Lost status)
  const activeDeals = leads.filter(
    (lead) => !["won", "lost"].includes(String(lead.status || "").toLowerCase())
  ).length;

  // Animations configuration
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-50 dark:bg-gray-950 min-h-screen space-y-6 transition-colors duration-200">
      {/* 1. Hero Welcome Banner */}
      <HeroSection />

      {/* 2. Six Premium Stats/KPI cards grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5"
      >
        <motion.div variants={itemVariants}>
          <StatsCard
            title="Total Leads"
            value={totalLeads}
            icon={Users}
            change="+12.4%"
            color="primary"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCard
            title="Won Leads"
            value={wonLeads}
            icon={Award}
            change="+18.2%"
            color="success"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCard
            title="Lost Leads"
            value={lostLeads}
            icon={XCircle}
            change="-4.5%"
            color="danger"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            icon={Target}
            change="+2.8%"
            color="warning"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCard
            title="Won Revenue"
            value={`$${wonRevenue}`}
            icon={DollarSign}
            change="+22.1%"
            color="success"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCard
            title="Active Deals"
            value={activeDeals}
            icon={Briefcase}
            change="+8.3%"
            color="primary"
          />
        </motion.div>
      </motion.div>

      {/* 3. Multi-column Analytics & Widgets grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Main core flow (Pipeline details & Recent additions) */}
        <div className="lg:col-span-2 space-y-6">
          <PipelineOverview leads={leads} />
          <RecentLeads leads={leads} />
        </div>

        {/* Central Widgets (Targets & Action Triggers) */}
        <div className="space-y-6">
          <PerformanceWidget leads={leads} />
          <QuickActions leads={leads} />
        </div>

        {/* Calendar and Activities Timeline logs */}
        <div className="space-y-6 lg:col-span-3 xl:col-span-1">
          <CalendarWidget leads={leads} />
          <RecentActivity leads={leads} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;