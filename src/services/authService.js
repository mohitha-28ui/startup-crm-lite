import api from "./api";

const authService = {
  /**
   * Registers a new user.
   * Sends POST request to /api/auth/register.
   *
   * @param {string} name - User's display name.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {Promise<Object>} The server response body containing user and token.
   */
  register: async (name, email, password) => {
    const response = await api.post("/api/auth/register", { name, email, password });
    return response.data;
  },

  /**
   * Logins an existing user.
   * Sends POST request to /api/auth/login.
   *
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {Promise<Object>} The server response body containing user and token.
   */
  login: async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  },

  /**
   * Logouts the current user by removing the token from localStorage.
   */
  logout: () => {
    localStorage.removeItem("crm-token");
  },

  /**
   * Retrieves the current user's profile.
   * Sends GET request to /api/auth/profile.
   *
   * @returns {Promise<Object>} The user profile data.
   */
  getProfile: async () => {
    const response = await api.get("/api/auth/profile");
    return response.data;
  },

  /**
   * Updates the current user's profile.
   * Sends PUT request to /api/auth/profile.
   *
   * @param {Object} data - Profile fields to modify (name, email, password).
   * @returns {Promise<Object>} The updated user profile data.
   */
  updateProfile: async (data) => {
    const response = await api.put("/api/auth/profile", data);
    return response.data;
  },
};

export default authService;
