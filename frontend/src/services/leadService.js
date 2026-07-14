import api from "./api";

/**
 * Format a lead object to ensure it has the `id` property mapped from `_id` 
 * to preserve compatibility with existing React components.
 */
const formatLead = (lead) => {
  if (!lead) return null;
  return {
    ...lead,
    id: lead._id || lead.id,
  };
};

const leadService = {
  /**
   * Fetches leads from the backend with query parameters (status, search, page, limit).
   *
   * @param {Object} params - Query params like { status, search, page, limit }.
   * @returns {Promise<Object>} Object containing the array of formatted leads and pagination details.
   */
  getLeads: async (params = {}) => {
    const response = await api.get("/api/leads", { params });
    const responseData = response.data; // Standardized API wrapper: { success: true, data: [...], pagination: {...} }
    
    if (responseData && Array.isArray(responseData.data)) {
      return {
        leads: responseData.data.map(formatLead),
        pagination: responseData.pagination,
      };
    }
    return { leads: [], pagination: {} };
  },

  /**
   * Creates a new lead.
   *
   * @param {Object} leadData - Lead fields to insert.
   * @returns {Promise<Object>} The created lead object.
   */
  createLead: async (leadData) => {
    const response = await api.post("/api/leads", leadData);
    const responseData = response.data; // { success: true, message: "...", data: {...} }
    return formatLead(responseData.data);
  },

  /**
   * Updates an existing lead.
   *
   * @param {string} id - The lead ID.
   * @param {Object} leadData - Fields to update.
   * @returns {Promise<Object>} The updated lead object.
   */
  updateLead: async (id, leadData) => {
    const response = await api.put(`/api/leads/${id}`, leadData);
    const responseData = response.data;
    return formatLead(responseData.data);
  },

  /**
   * Fast-updates only the status stage of a lead.
   *
   * @param {string} id - The lead ID.
   * @param {string} status - The new status value.
   * @returns {Promise<Object>} The updated lead object.
   */
  updateLeadStatus: async (id, status) => {
    const response = await api.patch(`/api/leads/${id}/status`, { status });
    const responseData = response.data;
    return formatLead(responseData.data);
  },

  /**
   * Deletes a lead.
   *
   * @param {string} id - The lead ID to delete.
   * @returns {Promise<Object>} Response body containing the message.
   */
  deleteLead: async (id) => {
    const response = await api.delete(`/api/leads/${id}`);
    return response.data;
  },

  /**
   * Retrieves aggregated dashboard lead statistics.
   *
   * @returns {Promise<Object>} Object containing stats: totalLeads, wonLeads, lostLeads, conversionRate, byStatus.
   */
  getLeadStats: async () => {
    const response = await api.get("/api/leads/stats/summary");
    return response.data.data;
  },

  /**
   * Retrieves monthly timeline statistics.
   *
   * @returns {Promise<Array>} Array of monthly timeline stats: [{ month: 'Jan', total: X, won: Y }, ...]
   */
  getMonthlyStats: async () => {
    const response = await api.get("/api/leads/stats/monthly");
    return response.data.data;
  },
};

export default leadService;
