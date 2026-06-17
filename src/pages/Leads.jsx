import React, { useContext, useState, useEffect } from "react";
import { LeadContext } from "../context/LeadContext";
import { Toaster, toast } from "react-hot-toast";

// Import custom lead widgets
import LeadForm from "../components/leads/LeadForm";
import LeadCard from "../components/leads/LeadCard";
import LeadTable from "../components/leads/LeadTable";

// Import Lucide React icons
import { Plus, LayoutGrid, List, Search, Filter, Briefcase, RefreshCw } from "lucide-react";

/**
 * Leads page component.
 * Manages view toggles, modal dialog triggers, and operations for Lead management
 * through context bindings and react-hot-toast alerts.
 *
 * @component
 * @returns {React.JSX.Element} The rendered Leads page.
 */
function Leads() {
  // Bind CRUD actions from LeadContext
  const { leads = [], addLead, updateLead, deleteLead } = useContext(LeadContext);

  // Layout and dialog state variables
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null); // stores lead being edited, or null for create

  // Search & Filter state variables
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Keyboard accessibility: Close modal on pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  /**
   * Opens the form modal in Create mode.
   */
  const handleOpenCreateModal = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  /**
   * Opens the form modal in Edit mode.
   * @param {Object} lead - The lead to edit.
   */
  const handleOpenEditModal = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  /**
   * Closes the form modal and resets context.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  /**
   * Submission handler for LeadForm.
   * @param {Object} formData - Form input values.
   */
  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      // Update Mode
      updateLead(selectedLead.id, formData);
      toast.success(`Updated lead "${formData.name}" successfully`, {
        style: {
          background: "#F0FDF4",
          color: "#166534",
          border: "1px solid #BBF7D0",
          fontSize: "14px",
          fontWeight: "600",
        },
      });
    } else {
      // Create Mode
      addLead(formData);
      toast.success(`Lead "${formData.name}" registered successfully`, {
        style: {
          background: "#F0FDF4",
          color: "#166534",
          border: "1px solid #BBF7D0",
          fontSize: "14px",
          fontWeight: "600",
        },
        icon: "🚀",
      });
    }
    handleCloseModal();
  };

  /**
   * Delete handler with styled red toast notifications.
   * @param {number|string} id - Lead ID.
   */
  const handleDeleteClick = (id) => {
    const leadToDelete = leads.find((l) => l.id === id);
    const leadName = leadToDelete ? leadToDelete.name : "Lead";
    
    if (window.confirm(`Are you sure you want to delete the lead "${leadName}"?`)) {
      deleteLead(id);
      toast.error(`Removed lead "${leadName}"`, {
        style: {
          background: "#FEF2F2",
          color: "#991B1B",
          border: "1px solid #FCA5A5",
          fontSize: "14px",
          fontWeight: "600",
        },
      });
    }
  };

  // Filter leads based on search text and status stage selections
  const filteredLeads = leads.filter((lead) => {
    const nameMatch = (lead.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const companyMatch = (lead.company || "").toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (lead.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const searchMatch = nameMatch || companyMatch || emailMatch;

    const statusMatch = statusFilter === "All" || String(lead.status || "").toLowerCase().trim() === statusFilter.toLowerCase().trim();

    return searchMatch && statusMatch;
  });

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Toast Alert System Provider */}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      {/* Page Heading & Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Lead Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Displaying {filteredLeads.length} of {leads.length} total opportunities
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
        >
          <Plus size={18} className="stroke-[2.5]" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filters & Display Mode Toggles Panel */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, company, or email..."
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Dropdown & Toggle Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 relative flex-1 sm:flex-initial">
            <Filter size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <select
              className="w-full pl-10 pr-8 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-sm appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Meeting Scheduled">Meeting Scheduled</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Toggle Display Layout Buttons */}
          <div className="flex items-center bg-slate-50 p-1 border border-slate-200 rounded-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-all duration-150 cursor-pointer ${
                viewMode === "table" ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <List size={18} className="stroke-[2.25]" />
            </button>
            
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-lg transition-all duration-150 cursor-pointer ${
                viewMode === "cards" ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
              }`}
              title="Card View"
              aria-label="Card View"
            >
              <LayoutGrid size={18} className="stroke-[2.25]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "table" ? (
        <>
          {/* Responsive Layout: Desktop shows table, mobile stacks as cards automatically */}
          <div className="hidden md:block">
            <LeadTable
              leads={filteredLeads}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteClick}
            />
          </div>
          <div className="block md:hidden grid grid-cols-1 gap-4">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        </>
      ) : (
        /* Card View: Responsive grid spacing */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Empty State Fallback */}
      {filteredLeads.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
          <Briefcase size={40} className="text-slate-300 stroke-[1.5] mb-3" />
          <h3 className="font-bold text-slate-800 text-lg">No matching leads found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm">
            Try adjusting your search keywords, checking status filters, or register a new lead context.
          </p>
        </div>
      )}

      {/* Modal Dialog Form Wrapper */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl border border-slate-100 max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside form
          >
            <LeadForm
              initialData={selectedLead}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Leads;