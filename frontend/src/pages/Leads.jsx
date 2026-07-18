import { useState, useEffect, useMemo, useCallback } from "react";
import { useLeads } from "../context/LeadContext";
import { Toaster, toast } from "react-hot-toast";

// Import custom lead widgets
import LeadForm from "../components/leads/LeadForm";
import LeadCard from "../components/leads/LeadCard";
import LeadTable from "../components/leads/LeadTable";
import SearchBar from "../components/common/SearchBar";
import FilterBar from "../components/common/FilterBar";
import EmptyState from "../components/common/EmptyState";

// Import Lucide React icons
import { Plus, LayoutGrid, List, X } from "lucide-react";

/**
 * Leads page component.
 * Manages view toggles, modal dialog triggers, and operations for Lead management
 * through context bindings and react-hot-toast alerts.
 *
 * @component
 * @returns {React.JSX.Element} The rendered Leads page.
 */
function Leads() {
  // Bind CRUD actions using custom useLeads hook
  const { leads = [], addLead, updateLead, deleteLead } = useLeads();

  // Layout and dialog state variables
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null); // stores lead being edited, or null for create

  // Search & Filter state variables
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  /**
   * Closes the form modal and resets context.
   */
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedLead(null);
  }, []);

  // Keyboard accessibility: Close modal on pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handleCloseModal]);

  /**
   * Opens the form modal in Create mode.
   */
  const handleOpenCreateModal = useCallback(() => {
    setSelectedLead(null);
    setIsModalOpen(true);
  }, []);

  /**
   * Opens the form modal in Edit mode.
   * @param {Object} lead - The lead to edit.
   */
  const handleOpenEditModal = useCallback((lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  }, []);

  /**
   * Submission handler for LeadForm.
   * @param {Object} formData - Form input values.
   */
  const handleFormSubmit = useCallback((formData) => {
    if (selectedLead) {
      // Update Mode
      updateLead(selectedLead.id, formData);
      toast.success(`Updated lead "${formData.name}" successfully`, {
        style: {
          background: "var(--toast-success-bg)",
          color: "var(--toast-success-color)",
          border: "1px solid var(--toast-success-border)",
          fontSize: "14px",
          fontWeight: "600",
        },
      });
    } else {
      // Create Mode
      addLead(formData);
      toast.success(`Lead "${formData.name}" registered successfully`, {
        style: {
          background: "var(--toast-success-bg)",
          color: "var(--toast-success-color)",
          border: "1px solid var(--toast-success-border)",
          fontSize: "14px",
          fontWeight: "600",
        },
        icon: "🚀",
      });
    }
    handleCloseModal();
  }, [selectedLead, updateLead, addLead, handleCloseModal]);

  /**
   * Delete handler with styled red toast notifications.
   * @param {number|string} id - Lead ID.
   */
  const handleDeleteClick = useCallback((id) => {
    const leadToDelete = leads.find((l) => l.id === id);
    const leadName = leadToDelete ? leadToDelete.name : "Lead";

    if (window.confirm(`Are you sure you want to delete the lead "${leadName}"?`)) {
      deleteLead(id);
      toast.error(`Removed lead "${leadName}"`, {
        style: {
          background: "var(--toast-error-bg)",
          color: "var(--toast-error-color)",
          border: "1px solid var(--toast-error-border)",
          fontSize: "14px",
          fontWeight: "600",
        },
      });
    }
  }, [leads, deleteLead]);

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => activeFilter === "All" || lead.status === activeFilter)
      .filter(
        (lead) =>
          (lead.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (lead.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (lead.email || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [leads, activeFilter, searchQuery]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveFilter("All");
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-slate-50 dark:bg-gray-950 min-h-screen space-y-6 transition-colors duration-200">
      {/* Toast Alert System Provider */}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      {/* Page Heading & Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Lead Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
            Displaying {filteredLeads.length} of {leads.length} total opportunities
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-5 py-3 w-full sm:w-auto justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer min-h-[44px]"
        >
          <Plus size={18} className="stroke-[2.5]" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filters & Display Mode Toggles Panel */}
      <div className="space-y-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Toggle Display Layout Buttons: Visible ONLY on Tablet (md to lg). Hidden on mobile (< md) and desktop (lg+) */}
          <div className="hidden md:flex lg:hidden items-center bg-slate-50 dark:bg-gray-800 p-1 border border-slate-200 dark:border-gray-700 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode("table")}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer ${
                viewMode === "table" ? "bg-white dark:bg-gray-900 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <List size={18} className="stroke-[2.25]" />
            </button>

            <button
              onClick={() => setViewMode("cards")}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer ${
                viewMode === "cards" ? "bg-white dark:bg-gray-900 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
              }`}
              title="Card View"
              aria-label="Card View"
            >
              <LayoutGrid size={18} className="stroke-[2.25]" />
            </button>
          </div>
        </div>

        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          leads={leads}
        />
      </div>

      {/* Main Content Area */}
      {filteredLeads.length === 0 ? (
        <EmptyState totalCount={leads.length} onClearFilters={handleClearFilters} />
      ) : (
        <>
          {/* 1. Desktop & Tablet Table Layout (CSS Responsive Toggle) */}
          <div className={`hidden lg:block ${viewMode === "table" ? "md:block" : "md:hidden"}`}>
            <LeadTable
              leads={filteredLeads}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteClick}
            />
          </div>

          {/* 2. Mobile & Tablet Cards Grid Layout (CSS Responsive Toggle) */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden ${viewMode === "cards" ? "md:grid" : "md:hidden"}`}>
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
      )}

      {/* Modal Dialog Form Wrapper */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 md:backdrop-blur-sm z-50 flex items-stretch md:items-center md:justify-center p-0 md:p-4"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
        >
          {/* Inner Dialog Box: Fills screen on mobile, centered and max-w-lg on tablet+ */}
          <div
            className="bg-white dark:bg-gray-900 w-full h-full min-h-screen md:min-h-0 md:h-auto md:max-w-lg rounded-none md:rounded-2xl border-0 md:border border-slate-100 dark:border-gray-800 p-5 sm:p-6 shadow-none md:shadow-2xl overflow-y-auto max-h-screen md:max-h-[90vh] animate-in fade-in zoom-in duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button (Top right, tap target 44x44px) */}
            <button
              onClick={handleCloseModal}
              type="button"
              className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors duration-200"
              aria-label="Close dialog modal"
            >
              <X size={20} />
            </button>

            <LeadForm
              key={selectedLead ? selectedLead.id : "new"}
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
