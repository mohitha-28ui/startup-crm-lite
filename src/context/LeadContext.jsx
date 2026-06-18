import { createContext, useContext, useState, useEffect } from "react";

/**
 * TypeScript-style shape of the Lead object:
 * 
 * interface Lead {
 *   id: string;
 *   name: string;
 *   company: string;
 *   email: string;
 *   phone: string;
 *   status: 'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost';
 *   source: 'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other';
 *   createdAt: string; // ISO date string
 * }
 */

export const LeadContext = createContext();

/**
 * LeadProvider component that manages the state and actions of leads.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Children components to be wrapped.
 * @returns {React.JSX.Element} The LeadProvider component.
 */
export function LeadProvider({ children }) {
  const [leads, setLeads] = useState(() => {
    try {
      const savedLeads = localStorage.getItem("leads");
      if (savedLeads) {
        return JSON.parse(savedLeads);
      }
    } catch (error) {
      console.error("Failed to parse leads from localStorage:", error);
    }
    // Default initial mock data if localStorage is empty
    return [
      {
        id: "1",
        name: "Sarah Jenkins",
        company: "Acme Corp",
        email: "sarah@acmecorp.com",
        phone: "555-0143",
        status: "Contacted",
        source: "LinkedIn",
        createdAt: new Date("2026-06-14").toISOString(),
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("leads", JSON.stringify(leads));
  }, [leads]);

  /**
   * Adds a new lead to the list, generating a unique ID and a createdAt timestamp.
   *
   * @param {Omit<Lead, 'id' | 'createdAt'>} leadData - The lead details.
   */
  const addLead = (leadData) => {
    const newLead = {
      ...leadData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setLeads((prevLeads) => [...prevLeads, newLead]);
  };

  /**
   * Updates an existing lead in the list.
   *
   * @param {string} id - The unique identifier of the lead.
   * @param {Partial<Lead>} updatedLead - The properties to update.
   */
  const updateLead = (id, updatedLead) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) => (lead.id === id ? { ...lead, ...updatedLead } : lead))
    );
  };

  /**
   * Deletes a lead from the list by its ID.
   *
   * @param {string} id - The unique identifier of the lead to delete.
   */
  const deleteLead = (id) => {
    setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
  };

  /**
   * Retrieves a specific lead by its ID.
   *
   * @param {string} id - The unique identifier of the lead to retrieve.
   * @returns {Lead|undefined} The matching lead object or undefined.
   */
  const getLeadById = (id) => {
    return leads.find((lead) => lead.id === id);
  };

  return (
    <LeadContext.Provider value={{ leads, addLead, updateLead, deleteLead, getLeadById }}>
      {children}
    </LeadContext.Provider>
  );
}

/**
 * Custom hook to access leads context with built-in provider validation error handling.
 *
 * @returns {{
 *   leads: Array<Object>,
 *   addLead: function,
 *   updateLead: function,
 *   deleteLead: function,
 *   getLeadById: function
 * }} Leads context values.
 * @throws {Error} If hook is used outside of a LeadProvider.
 */
export function useLeads() {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error("useLeads must be used within a LeadProvider");
  }
  return context;
}