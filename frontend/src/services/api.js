import axios from "axios";
import toast from "react-hot-toast";

// Force empty string (same domain) in production (requests will use relative routes like /api/auth/register via Vercel proxy), falling back to local port 5000 in development
const apiURL = (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1")
  ? ""
  : (import.meta.env.VITE_API_URL || "http://localhost:5000");

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
      const isLocalhost = apiURL.includes("localhost") || apiURL.includes("127.0.0.1");
      const isHttps = window.location.protocol === "https:";
      
      let debugMessage = `Connection failed to API URL: ${apiURL}. `;
      if (isLocalhost && isHttps) {
        debugMessage += "Blocked by Mixed Content: Your browser blocks HTTP connections to localhost when loaded over HTTPS. ";
      } else {
        debugMessage += "Possible causes: Backend server is down, CORS blocking, or invalid URL configuration. ";
      }
      
      console.error("[CRM API Network Error]", debugMessage, error);
      
      toast.error(
        `Cannot connect to server at ${apiURL}. Verify server status, CORS headers, or network.`,
        {
          id: "network-error", // Avoid toast spamming
          duration: 6000,
        }
      );
      return Promise.reject(new Error(`Cannot connect to server at ${apiURL}`));
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
