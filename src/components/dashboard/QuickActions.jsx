import { useNavigate } from "react-router-dom";
import { Plus, Users, Download } from "lucide-react";

/**
 * QuickActions component displays a dashboard panel with actions to add leads,
 * view all leads, and export lead data to a CSV file.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.leads - Complete list of leads for data export.
 * @returns {React.JSX.Element} The rendered QuickActions panel.
 */
function QuickActions({ leads = [] }) {
  const navigate = useNavigate();

  /**
   * Generates and downloads a CSV spreadsheet representing current leads.
   */
  const handleExportData = () => {
    if (!leads || leads.length === 0) {
      alert("No lead data is available for export.");
      return;
    }

    // Build the CSV string safely escaping quotes
    const headers = ["ID", "Contact Name", "Company", "Status", "Value"];
    const rows = leads.map((lead) => [
      lead.id || "",
      `"${String(lead.name || "").replace(/"/g, '""')}"`,
      `"${String(lead.company || "").replace(/"/g, '""')}"`,
      `"${String(lead.status || "").replace(/"/g, '""')}"`,
      `"${String(lead.value || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const downloadLink = document.createElement("a");
    
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadLink.setAttribute("href", encodedUri);
    downloadLink.setAttribute("download", `crm_leads_export_${dateStr}.csv`);
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h2>

      <div className="flex flex-col gap-4">
        {/* Add New Lead */}
        <button
          onClick={() => navigate("/leads")}
          className="flex items-center justify-between p-4 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 group text-left shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <Plus size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="font-semibold text-sm">Add New Lead</p>
              <p className="text-xs text-blue-100 mt-0.5">Register a hot opportunity</p>
            </div>
          </div>
        </button>

        {/* View All Leads */}
        <button
          onClick={() => navigate("/leads")}
          className="flex items-center justify-between p-4 w-full bg-slate-50 dark:bg-gray-850 hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 rounded-xl transition-all duration-200 group text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-900 rounded-lg text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700">
              <Users size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-800 dark:text-gray-200">View All Leads</p>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Browse all pipeline details</p>
            </div>
          </div>
        </button>

        {/* Export Data */}
        <button
          onClick={handleExportData}
          className="flex items-center justify-between p-4 w-full bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/40 rounded-xl transition-all duration-200 group text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-900 rounded-lg text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/30">
              <Download size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="font-semibold text-sm text-green-800 dark:text-green-300">Export Lead Data</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">Generate a CSV spreadsheet</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default QuickActions;