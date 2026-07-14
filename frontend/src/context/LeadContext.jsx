/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import leadService from "../services/leadService";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

export const LeadContext = createContext();

export function LeadProvider({ children }) {
  const { token } = useAuth();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  });

  // Fetch leads with optional query parameters
  const fetchLeads = async (params = {}) => {
    setIsLoading(true);
    try {
      const result = await leadService.getLeads(params);
      setLeads(result.leads);
      setPagination(result.pagination);
    } catch (error) {
      toast.error(error.message || "Failed to fetch leads");
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically fetch leads when the user logs in / token changes
  useEffect(() => {
    if (token) {
      fetchLeads();
    } else {
      setLeads([]);
    }
  }, [token]);

  /**
   * Adds a new lead via API.
   *
   * @param {Object} leadData - The lead details.
   */
  const addLead = async (leadData) => {
    setIsLoading(true);
    try {
      const newLead = await leadService.createLead(leadData);
      setLeads((prevLeads) => [newLead, ...prevLeads]);
      toast.success("Lead created successfully!");
      return newLead;
    } catch (error) {
      toast.error(error.message || "Failed to create lead");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates an existing lead via API.
   *
   * @param {string} id - The unique identifier of the lead.
   * @param {Object} updatedData - The properties to update.
   */
  const updateLead = async (id, updatedData) => {
    setIsLoading(true);
    try {
      // Check if updating only status or all fields
      let updatedLead;
      const keys = Object.keys(updatedData);
      if (keys.length === 1 && keys[0] === "status") {
        updatedLead = await leadService.updateLeadStatus(id, updatedData.status);
      } else {
        updatedLead = await leadService.updateLead(id, updatedData);
      }

      setLeads((prevLeads) =>
        prevLeads.map((lead) => (lead.id === id ? updatedLead : lead))
      );
      toast.success("Lead updated successfully!");
      return updatedLead;
    } catch (error) {
      toast.error(error.message || "Failed to update lead");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Deletes a lead by its ID via API.
   *
   * @param {string} id - The unique identifier of the lead to delete.
   */
  const deleteLead = async (id) => {
    setIsLoading(true);
    try {
      await leadService.deleteLead(id);
      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
      toast.success("Lead deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete lead");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Retrieves a specific lead by its ID from local state.
   *
   * @param {string} id - The unique identifier of the lead to retrieve.
   * @returns {Object|undefined} The matching lead object or undefined.
   */
  const getLeadById = (id) => {
    return leads.find((lead) => lead.id === id);
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        isLoading,
        pagination,
        fetchLeads,
        addLead,
        updateLead,
        deleteLead,
        getLeadById,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error("useLeads must be used within a LeadProvider");
  }
  return context;
}
