import { useLeads } from "../context/LeadContext";

// Import layout / sub-dashboard components
import HeroSection from "../components/dashboard/HeroSection";
import StatsCard from "../components/dashboard/StatsCard";
import PipelineOverview from "../components/dashboard/PipelineOverview";
import RecentLeads from "../components/dashboard/RecentLeads";
import QuickActions from "../components/dashboard/QuickActions";

// Import Lucide React icons
import { Users, Award, XCircle, Target } from "lucide-react";

function Dashboard() {
  const { leads = [] } = useLeads();

  // Use only real backend data
  const totalLeads = leads.length;

  const wonLeads = leads.filter(
    (lead) => String(lead.status || "").toLowerCase() === "won"
  ).length;

  const lostLeads = leads.filter(
    (lead) => String(lead.status || "").toLowerCase() === "lost"
  ).length;

  const conversionRate =
    totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 bg-slate-50 dark:bg-gray-950 min-h-screen space-y-6 transition-colors duration-200">
      <HeroSection />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          change="+0%"
          color="primary"
        />

        <StatsCard
          title="Won Leads"
          value={wonLeads}
          icon={Award}
          change="+0%"
          color="success"
        />

        <StatsCard
          title="Lost Leads"
          value={lostLeads}
          icon={XCircle}
          change="+0%"
          color="danger"
        />

        <StatsCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={Target}
          change="+0%"
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PipelineOverview leads={leads} />
        <QuickActions leads={leads} />

        <div className="lg:col-span-2">
          <RecentLeads leads={leads} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;