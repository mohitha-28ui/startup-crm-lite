import { createContext, useState, useEffect } from "react";

export const LeadContext = createContext();

export function LeadProvider({ children }) {
  const [leads, setLeads] = useState(() => {
    const savedLeads = localStorage.getItem("leads");
    return savedLeads
      ? JSON.parse(savedLeads)
      : [
          {
            id: 1,
            name: "Sarah Jenkins",
            company: "Acme Corp",
            email: "sarah@acmecorp.com",
            phone: "555-0143",
            value: "$8500",
            status: "Contacted",
            source: "LinkedIn",
            dateAdded: "2026-06-14",
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("leads", JSON.stringify(leads));
  }, [leads]);

  const addLead = (lead) => {
    const newLead = {
      id: Date.now(),
      dateAdded: new Date().toISOString().slice(0, 10),
      value: lead.value || "$0",
      ...lead,
    };
    setLeads([...leads, newLead]);
  };

  const updateLead = (id, updatedLead) => {
    setLeads(
      leads.map((lead) => (lead.id === id ? { ...lead, ...updatedLead } : lead))
    );
  };

  const deleteLead = (id) => {
    setLeads(leads.filter((lead) => lead.id !== id));
  };

  return (
    <LeadContext.Provider value={{ leads, addLead, updateLead, deleteLead }}>
      {children}
    </LeadContext.Provider>
  );
}