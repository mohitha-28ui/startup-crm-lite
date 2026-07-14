import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("crm-token"));
  const [isLoading, setIsLoading] = useState(true);

  // Recover session on mount if token is found
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("crm-token");
      if (storedToken) {
        try {
          const profile = await authService.getProfile(); // GET /api/auth/profile
          setUser(profile.data.user);
          setToken(storedToken);
        } catch (error) {
          console.error("Failed to restore session:", error);
          localStorage.removeItem("crm-token");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Logins a user and saves the token to localStorage.
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      const { token: receivedToken, user: receivedUser } = result.data;
      
      localStorage.setItem("crm-token", receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      toast.success(`Welcome back, ${receivedUser.name}!`);
      return receivedUser;
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registers a new user.
   */
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const result = await authService.register(name, email, password);
      const { token: receivedToken, user: receivedUser } = result.data;

      localStorage.setItem("crm-token", receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      toast.success("Account created successfully.");
      return receivedUser;
    } catch (error) {
      toast.error(error.message || "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logouts the current user and clears credentials.
   */
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
    // Redirect securely to login
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
