import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { ThemeContext } from "../context/ThemeContext";

const Login = () => {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    captcha: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [captchaText, setCaptchaText] = useState(""); // Store the correct captcha text
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCaptcha();

    // Check if credentials were remembered
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const fetchCaptcha = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/auth/captcha-text"
      );
      setCaptchaText(res.data.captchaText); // Store the correct captcha text
      setFormData((prev) => ({ ...prev, captcha: "" })); // Clear previous captcha input
    } catch (err) {
      console.error("Failed to load captcha", err);
      toast.error("Failed to load captcha");
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Please enter a valid email address";
        break;
      case "password":
        if (!value) error = "Password is required";
        break;
      case "captcha":
        if (!value) error = "Captcha is required";
        else if (captchaText && value !== captchaText)
          error = "Incorrect captcha";
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [formData, touched, captchaText]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to show errors
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form (including CAPTCHA)
    const isValid = validateForm();
    if (!isValid) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email: formData.email,
        password: formData.password,
        captcha: formData.captcha,
      });

      localStorage.setItem("token", res.data.token);

      // Remember email if checkbox is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data || "Invalid credentials or captcha";
      toast.error(errorMessage);

      // Fetch new CAPTCHA on any failure for simplicity
      fetchCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = (fieldName) => {
    return touched[fieldName] && !errors[fieldName];
  };

  const hasError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-indigo-50"
      }`}
    >
      <div
        className={`rounded-2xl shadow-xl p-8 max-w-4xl w-full ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold mb-6 text-center"
        >
          Welcome Back
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Login Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <input
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full p-3 border rounded-lg pl-10 focus:ring-2 focus:outline-none ${
                      hasError("email")
                        ? "border-red-500 focus:ring-red-500"
                        : isValid("email")
                        ? "border-green-500 focus:ring-green-500"
                        : theme === "dark"
                        ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  {isValid("email") && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 absolute right-3 top-3" />
                  )}
                  {hasError("email") && (
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500 absolute right-3 top-3" />
                  )}
                </div>
                {hasError("email") && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password *
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <LockClosedIcon className="h-5 w-5" />
                  </div>
                  <input
                    name="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full p-3 border rounded-lg pl-10 pr-10 focus:ring-2 focus:outline-none ${
                      hasError("password")
                        ? "border-red-500 focus:ring-red-500"
                        : isValid("password")
                        ? "border-green-500 focus:ring-green-500"
                        : theme === "dark"
                        ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {hasError("password") && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 rounded focus:ring-blue-500"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className={`text-sm font-medium ${
                    theme === "dark"
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-800"
                  } transition-colors`}
                >
                  Forgot your password?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-3 rounded-lg font-medium text-white ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                }`}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </motion.button>
            </div>

            {/* Right Column - Captcha */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Captcha *
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg font-mono">{captchaText}</span>
                  <motion.button
                    type="button"
                    onClick={fetchCaptcha}
                    whileHover={{ rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-full ${
                      theme === "dark"
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    title="Reload captcha"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </motion.button>
                </div>
                <div className="relative">
                  <input
                    name="captcha"
                    placeholder="Enter captcha text"
                    value={formData.captcha}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${
                      hasError("captcha")
                        ? "border-red-500 focus:ring-red-500"
                        : isValid("captcha")
                        ? "border-green-500 focus:ring-green-500"
                        : theme === "dark"
                        ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  {isValid("captcha") && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 absolute right-3 top-3" />
                  )}
                  {hasError("captcha") && (
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500 absolute right-3 top-3" />
                  )}
                </div>
                {hasError("captcha") && (
                  <p className="mt-1 text-sm text-red-500">{errors.captcha}</p>
                )}
              </div>

              <div
                className={`p-4 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 border border-gray-600"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <h3 className="font-medium mb-2">Demo Credentials</h3>
                <p className="text-sm opacity-75">
                  For testing purposes, you can use:
                  <br />
                  Email: demo@example.com
                  <br />
                  Password: demo123
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className={`font-medium ${
                      theme === "dark"
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-800"
                    } transition-colors`}
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
