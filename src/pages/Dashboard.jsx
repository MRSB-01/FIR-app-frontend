import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import {
  UserIcon,
  UsersIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to access the dashboard");
      navigate("/login");
      return;
    }

    fetchUserData(token);
    fetchDashboardStats(token);
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const res = await axios.get("http://localhost:8080/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user data", err);
      toast.error("Failed to load user data");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const fetchDashboardStats = async (token) => {
    try {
      setTimeout(async () => {
        try {
          setStats({
            totalUsers: 1247,
            activeSessions: 23,
            pendingTasks: 12,
            completedTasks: 89,
          });
          setShowSuccessAnimation(true);
          setTimeout(() => setShowSuccessAnimation(false), 3000);
        } catch (err) {
          console.error("Failed to fetch dashboard stats", err);
          toast.error("Failed to load dashboard stats");
        } finally {
          setLoading(false);
        }
      }, 1500);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
      toast.error("Failed to load dashboard stats");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const quickActions = [
    {
      title: "View Reports",
      icon: ChartBarIcon,
      onClick: () => navigate("/report"),
      color: "bg-blue-500",
    },
    {
      title: "Create FIR",
      icon: DocumentTextIcon,
      onClick: () => navigate("/form"),
      color: "bg-green-500",
    },
    {
      title: "User Management",
      icon: UsersIcon,
      onClick: () => toast.info("User management feature coming soon"),
      color: "bg-purple-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300"
          >
            Loading your dashboard...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen p-4 md:p-6 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800"
      }`}
    >
      {/* Success Animation */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircleIcon className="w-12 h-12 text-green-500" />
              </motion.div>
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-semibold text-gray-800 dark:text-white mb-2"
              >
                Dashboard Loaded Successfully!
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 dark:text-gray-300"
              >
                Your data is ready to explore
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Welcome back, {user?.fullName || user?.email || "User"}!
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogoutModal(true)}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
            Logout
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* User Info Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className={`p-5 rounded-2xl shadow-lg flex flex-col ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
                <UserIcon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold">User Profile</h2>
            </div>
            {user ? (
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Email
                </p>
                <p className="truncate">{user.email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Name
                </p>
                <p>{user.fullName || "N/A"}</p>
              </div>
            ) : (
              <p className="text-red-500">User data not loaded</p>
            )}
          </motion.div>

          {/* Stats Cards */}
          {[
            {
              title: "Total Users",
              value: stats.totalUsers,
              icon: UsersIcon,
              color: "bg-green-500",
              bgColor: "bg-green-100",
              darkBgColor: "dark:bg-green-900/30",
              delay: 0.4,
            },
            {
              title: "Active Sessions",
              value: stats.activeSessions,
              icon: ClockIcon,
              color: "bg-purple-500",
              bgColor: "bg-purple-100",
              darkBgColor: "dark:bg-purple-900/30",
              delay: 0.5,
            },
            {
              title: "Pending Tasks",
              value: stats.pendingTasks,
              icon: DocumentTextIcon,
              color: "bg-yellow-500",
              bgColor: "bg-yellow-100",
              darkBgColor: "dark:bg-yellow-900/30",
              delay: 0.6,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: stat.delay }}
              whileHover={{ y: -5 }}
              className={`p-5 rounded-2xl shadow-lg flex flex-col ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.title}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-full ${stat.bgColor} ${stat.darkBgColor}`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color} text-white`} />
                </div>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: stat.delay + 0.2, duration: 1 }}
                className="h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-2"
              />
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.onClick}
                className={`p-4 rounded-2xl shadow-lg text-left ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } transition-all duration-300`}
              >
                <div
                  className={`p-3 rounded-full ${action.color} w-12 h-12 flex items-center justify-center mb-3`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Click to access this feature
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className={`p-5 rounded-2xl shadow-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 + item * 0.1 }}
                className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                  <DocumentTextIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">New FIR report submitted</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    2 hours ago
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
