import React, { useContext } from "react";
import { LeadContext } from "../context/LeadContext";

// Import layout / sub-dashboard components
import HeroSection from "../components/dashboard/HeroSection";
import StatsCard from "../components/dashboard/StatsCard";
import PipelineOverview from "../components/dashboard/PipelineOverview";
import RecentLeads from "../components/dashboard/RecentLeads";
import QuickActions from "../components/dashboard/QuickActions";

// Import Lucide React icons for stats cards
import { Users, Award, XCircle, Target } from "lucide-react";

/**
 * Dashboard page component of Startup CRM Lite.
 * Assembles StatsCards, PipelineOverview, RecentLeads, and QuickActions panels,
 * utilizing context data merged with rich baseline mockup datasets.
 *
 * @component
 * @returns {React.JSX.Element} The rendered Dashboard page.
 */
function Dashboard() {
  const { leads: contextLeads = [] } = useContext(LeadContext);

  // 1. Establish robust baseline mock data for immediate visual impact
  const defaultSampleLeads = [
    { id: 1, name: "Mohitha", company: "Acme Corp", value: "$8,500", status: "In Progress", dateAdded: "Jun 14, 2026" },
    { id: 2, name: "John Smith", company: "TechNova", value: "$5,200", status: "Won", dateAdded: "Jun 15, 2026" },
    { id: 3, name: "Emma Wilson", company: "CloudSync", value: "$12,000", status: "New", dateAdded: "Jun 15, 2026" },
    { id: 4, name: "Liam Carter", company: "Apex Digital", value: "$4,300", status: "Contacted", dateAdded: "Jun 15, 2026" },
    { id: 5, name: "Sophia Martinez", company: "Starlight Media", value: "$9,500", status: "Won", dateAdded: "Jun 16, 2026" },
    { id: 6, name: "David Kim", company: "Nexus Health", value: "$15,000", status: "In Progress", dateAdded: "Jun 16, 2026" },
    { id: 7, name: "Freddie Vance", company: "Vocal Dynamics", value: "$25,000", status: "Won", dateAdded: "Jun 16, 2026" },
    { id: 8, name: "Mohan", company: "Enigma Security", value: "$18,500", status: "Lost", dateAdded: "Jun 16, 2026" },
  ];

  // 2. Intelligently merge context leads (so user-added leads instantly display) with mock baseline
  const mergedLeads = [...contextLeads];
  defaultSampleLeads.forEach((sample) => {
    const isDuplicate = contextLeads.some(
      (cl) => cl.id === sample.id || cl.name.toLowerCase() === sample.name.toLowerCase()
    );
    if (!isDuplicate) {
      mergedLeads.push(sample);
    }
  });

  // 3. Compute metric aggregations
  const totalLeads = mergedLeads.length;
  const wonLeads = mergedLeads.filter(
    (lead) => String(lead.status || "").toLowerCase().trim() === "won"
  ).length;
  const lostLeads = mergedLeads.filter(
    (lead) => String(lead.status || "").toLowerCase().trim() === "lost"
  ).length;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Visual greeting banner */}
      <HeroSection />

      {/* Metrics Card Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          change="+14.2%"
          color="primary"
        />

        <StatsCard
          title="Won Leads"
          value={wonLeads}
          icon={Award}
          change="+18.2%"
          color="success"
        />

        <StatsCard
          title="Lost Leads"
          value={lostLeads}
          icon={XCircle}
          change="-8.4%"
          color="danger"
        />

        <StatsCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={Target}
          change="+5.2%"
          color="warning"
        />
      </div>

      {/* Main split dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual overview & detailed records (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <PipelineOverview leads={mergedLeads} />
          <RecentLeads leads={mergedLeads} />
        </div>

        {/* Right Column: command shortcuts (1/3 width) */}
        <div className="lg:col-span-1">
          <QuickActions leads={mergedLeads} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;