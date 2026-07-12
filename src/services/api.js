import axios from "axios";
import toast from "react-hot-toast";

// Determine the API base URL from the environment variables (default to local port 5000 if not set)
const apiURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: apiURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Automatically inject the stored JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("crm-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardize error management and session lifetimes
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if it's a network error (no response received)
    if (!error.response) {
      toast.error("Cannot connect to server. Check your connection.", {
        id: "network-error", // Avoid toast spamming
      });
      return Promise.reject(new Error("Cannot connect to server. Check your connection."));
    }

    const { status, data } = error.response;

    // Handle session expirations or unauthorized requests
    if (status === 401) {
      const token = localStorage.getItem("crm-token");
      if (token) {
        localStorage.removeItem("crm-token");
        toast.error("Session expired. Please login again.", {
          id: "session-expired",
        });
      }
      // Programmatically redirect to login page
      window.location.href = "/login";
    }

    // Pass data along or encapsulate error messages
    const errorMessage = data?.message || "An unexpected error occurred.";
    const apiError = new Error(errorMessage);
    apiError.status = status;
    apiError.errors = data?.errors || null;

    return Promise.reject(apiError);
  }
);

export default api;
