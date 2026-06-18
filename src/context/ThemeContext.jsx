import { createContext, useContext, useState, useEffect } from "react";

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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
    } catch (error) {
      console.error("Failed to parse theme from localStorage:", error);
    }
    return false;
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    } catch (error) {
      console.error("Failed to apply theme to documentElement or set in localStorage:", error);
    }
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
