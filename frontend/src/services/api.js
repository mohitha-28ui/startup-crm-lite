import axios from "axios";
import toast from "react-hot-toast";

const apiURL = import.meta.env.VITE_API_URL || "";

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
      const isLocalhost = apiURL && (apiURL.includes("localhost") || apiURL.includes("127.0.0.1"));
      const isHttps = window.location.protocol === "https:";
      
      let debugMessage = `Connection failed to API. `;
      if (isLocalhost && isHttps) {
        debugMessage += "Blocked by Mixed Content: Your browser blocks HTTP connections to localhost when loaded over HTTPS. ";
      } else {
        debugMessage += "Possible causes: Backend server is down, CORS blocking, or invalid URL configuration. ";
      }
      
      console.error("[CRM API Network Error]", debugMessage, error);
      
      const displayUrl = isLocalhost ? "the server" : (apiURL || "the server");
      toast.error(
        "Unable to connect to the server. Please try again.",
        {
          id: "network-error", // Avoid toast spamming
          duration: 6000,
        }
      );
      return Promise.reject(new Error("Unable to connect to the server. Please try again."));
    }

    const { status, data } = error.response;

    // Handle session expirations or unauthorized requests
    if (status === 401) {
      const isAuthEndpoint = error.config?.url?.includes("/auth/login") || error.config?.url?.includes("/auth/register");
      if (!isAuthEndpoint) {
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
