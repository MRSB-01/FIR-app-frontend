import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import {
  UserIcon,
  LockClosedIcon,
  PhoneIcon,
  CameraIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNumber: "",
    photo: null,
    password: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://fir-app-backend-1.onrender.com/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (isMounted) {
          setUser(res.data);
          setFormData({
            firstName: res.data.firstName,
            middleName: res.data.middleName,
            lastName: res.data.lastName,
            mobileNumber: res.data.mobileNumber,
            photo: null,
            password: "",
          });
          setPreviewImage(
            res.data.photoBase64
              ? `data:image/png;base64,${res.data.photoBase64}`
              : null
          );
        }
      } catch (err) {
        if (isMounted) toast.error("Failed to load profile");
      } finally {
        if (isMounted) {
          // Ensure loader shows for at least 1 second
          setTimeout(() => {
            setLoading(false);
            setShowLoader(false);
          }, 1000);
        }
      }
    };

    loadProfile();

    // Cleanup to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, photo: file }));
    setPreviewImage(file ? URL.createObjectURL(file) : null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    if (formData.firstName)
      formDataToSend.append("firstName", formData.firstName);
    if (formData.middleName)
      formDataToSend.append("middleName", formData.middleName);
    if (formData.lastName) formDataToSend.append("lastName", formData.lastName);
    if (formData.mobileNumber)
      formDataToSend.append("mobileNumber", formData.mobileNumber);
    if (formData.photo) formDataToSend.append("photo", formData.photo);
    if (formData.password) formDataToSend.append("password", formData.password);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://fir-app-backend-1.onrender.com/api/auth/profile",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Profile updated successfully");
      setIsModalOpen(false);
      fetchProfile();
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://fir-app-backend-1.onrender.com/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setFormData({
        firstName: res.data.firstName,
        middleName: res.data.middleName,
        lastName: res.data.lastName,
        mobileNumber: res.data.mobileNumber,
        photo: null,
        password: "",
      });
      setPreviewImage(
        res.data.photoBase64
          ? `data:image/png;base64,${res.data.photoBase64}`
          : null
      );
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  if (showLoader) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, repeatType: "reverse" },
          }}
          className="relative"
        >
          <Cog6ToothIcon className="h-16 w-16 text-blue-500 dark:text-blue-400" />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 text-sm"
          >
            Loading...
          </motion.span>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900"
    >
      {/* Profile Card */}
      {user && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.8,
          }}
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center relative overflow-hidden"
        >
          {/* Background decorative element */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="absolute -top-16 -right-16 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-50"
          />
          <motion.div
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-50"
          />

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="flex justify-center mb-4 relative z-10"
          >
            <motion.img
              whileHover={{ scale: 1.05, rotate: 2 }}
              src={previewImage || "/default-avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400 shadow-md"
            />
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
          >
            {user.fullName || "User"}
          </motion.h2>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-2 text-gray-600 dark:text-gray-300 mb-6"
          >
            <p className="flex items-center justify-center">
              <UserIcon className="h-5 w-5 mr-2" /> {user.firstName}{" "}
              {user.middleName} {user.lastName}
            </p>
            <p className="flex items-center justify-center">
              <PhoneIcon className="h-5 w-5 mr-2" />{" "}
              {user.mobileNumber || "N/A"}
            </p>
            <p className="flex items-center justify-center">
              <LockClosedIcon className="h-5 w-5 mr-2" /> {user.email}
            </p>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center relative z-10 shadow-md"
          >
            <CameraIcon className="h-5 w-5 mr-2" /> Update Profile
          </motion.button>
        </motion.div>
      )}

      {/* Update Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <motion.h2
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl font-semibold text-gray-900 dark:text-gray-100"
                >
                  Update Profile
                </motion.h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </motion.button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                {[
                  { label: "First Name", name: "firstName" },
                  { label: "Middle Name", name: "middleName" },
                  { label: "Last Name", name: "lastName" },
                  { label: "Mobile Number", name: "mobileNumber" },
                ].map((field, index) => (
                  <motion.div
                    key={field.name}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {field.label}
                    </label>
                    <input
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </motion.div>
                ))}

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {previewImage && (
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      src={previewImage}
                      alt="Preview"
                      className="mt-2 w-24 h-24 rounded-full object-cover mx-auto shadow-md"
                    />
                  )}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex justify-end space-x-4 pt-4"
                >
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-2" /> Save
                  </motion.button>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(false)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <XMarkIcon className="h-5 w-5 mr-2" /> Cancel
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;
