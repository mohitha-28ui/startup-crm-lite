import { useAuth } from "../../context/AuthContext";
import { useLeads } from "../../context/LeadContext";

/**
 * Banner section on the Dashboard greeting the logged-in user and showing brief statistics.
 */
function HeroSection() {
  const { user } = useAuth();
  const { leads = [] } = useLeads();

  // Extract user's first name, defaulting to "Sana" if anonymous/mock
  const firstName = user ? user.name.split(" ")[0] : "Sana";
  
  // Calculate count of leads created today
  const today = new Date().toDateString();
  const leadsCreatedToday = leads.filter(
    (lead) => new Date(lead.createdAt).toDateString() === today
  ).length;

  return (
    <div className="bg-gradient-to-r from-blue-950 to-indigo-900 text-white p-8 rounded-3xl shadow-lg">
      <span className="bg-indigo-700 px-4 py-2 rounded-full text-sm">
        Startup CRM Lite Active
      </span>

      <h1 className="text-4xl sm:text-5xl font-bold mt-4">
        Welcome back, {firstName}!
      </h1>

      <p className="text-gray-305 text-slate-200 mt-4 text-base sm:text-lg max-w-xl leading-relaxed">
        Your CRM has captured {leadsCreatedToday > 0 ? leadsCreatedToday : "new"} leads today. 
        Check your latest analytics and target summaries below.
      </p>
    </div>
  );
}

export default HeroSection;