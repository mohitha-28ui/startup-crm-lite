/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const ThemeContext = createContext();

/**
 * ThemeProvider component that manages light/dark mode and updates the HTML document root element.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Children components to wrap.
 * @returns {React.JSX.Element} The ThemeProvider component.
 */
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorage("startup-crm-theme", false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  /**
   * Toggles the current theme between light and dark modes.
   */
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to access theme context with validation error handling.
 *
 * @returns {{
 *   isDarkMode: boolean,
 *   toggleTheme: function
 * }} Theme context values.
 * @throws {Error} If hook is used outside of a ThemeProvider.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
