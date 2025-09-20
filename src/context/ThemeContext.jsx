// src/context/ThemeContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or system preference
  const getInitialTheme = () => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return "light";
    
    try {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) return storedTheme;
      
      // Check for system preference
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    
    return "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  // Add theme change listener for system preference changes
  useEffect(() => {
    if (!window.matchMedia) return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      // Only auto-change if user hasn't explicitly set a preference
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark"
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};