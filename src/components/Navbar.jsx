import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  // Hide navbar if user is logged in
  if (isLoggedIn) return null;

  const navItems = [
    { name: "Home", icon: HomeIcon, path: "/" },
    { name: "Login", icon: ArrowRightOnRectangleIcon, path: "/login" },
    { name: "Register", icon: UserPlusIcon, path: "/register" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                FIR System
              </span>
            </div>
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={item.path}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center"
                >
                  <item.icon className="h-5 w-5 mr-1" />
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 p-2 rounded-md"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 shadow-md">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={item.path}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
