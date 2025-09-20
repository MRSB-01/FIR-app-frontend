import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import {
  MoonIcon,
  SunIcon,
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  Bars3Icon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Effect to handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect to close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: HomeIcon,
      showInMobile: true,
    },
    {
      name: "FIR Form",
      path: "/form",
      icon: DocumentTextIcon,
      showInMobile: true,
    },
    {
      name: "Report",
      path: "/report",
      icon: ChartBarIcon,
      showInMobile: true,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: UserCircleIcon,
      showInMobile: true,
    },
  ];

  return (
    <div className={`flex h-screen ${theme === "dark" ? "dark" : ""}`}>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300">
        <div className="p-4 font-bold text-xl text-gray-800 dark:text-white flex items-center justify-between">
          <span>FIR App</span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <SunIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        </div>
        <nav className="flex-1 mt-4">
          <ul className="space-y-1 p-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center w-full text-left p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
          <h1 className="font-bold text-lg text-gray-800 dark:text-white">
            FIR App
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <MoonIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <SunIcon className="h-6 w-6 text-gray-300" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 z-50 md:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 font-bold text-xl text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 flex items-center justify-between transition-colors duration-300">
            <span>Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <nav className="flex-1 mt-4">
            <ul className="space-y-1 p-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center w-full text-left p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        <AnimatePresence>
          {showLogoutModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Confirm Logout
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to log out?
                </p>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 transition-colors duration-300">
          {children}
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg flex justify-around p-2 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
          {navItems
            .filter((item) => item.showInMobile)
            .map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;
