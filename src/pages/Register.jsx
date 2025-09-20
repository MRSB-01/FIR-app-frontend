import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { ThemeContext } from "../context/ThemeContext";

const Register = () => {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    fullName: "",
    mobileNumber: "",
    photo: null, // Change to file object instead of base64
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Validation rules
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        else if (value.length < 2)
          error = "First name must be at least 2 characters";
        else if (!/^[a-zA-Z]+$/.test(value))
          error = "First name can only contain letters";
        break;
      case "middleName":
        if (value && !/^[a-zA-Z]+$/.test(value))
          error = "Middle name can only contain letters";
        break;
      case "lastName":
        if (!value.trim()) error = "Last name is required";
        else if (value.length < 2)
          error = "Last name must be at least 2 characters";
        else if (!/^[a-zA-Z]+$/.test(value))
          error = "Last name can only contain letters";
        break;
      case "mobileNumber":
        if (!value) error = "Mobile number is required";
        else if (!/^\d{10}$/.test(value))
          error = "Mobile number must be 10 digits";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Please enter a valid email address";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8)
          error = "Password must be at least 8 characters";
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value))
          error = "Password must contain uppercase, lowercase and numbers";
        break;
      case "confirmPassword":
        if (!value) error = "Please confirm your password";
        else if (value !== formData.password) error = "Passwords do not match";
        break;
      case "photo":
        if (!value) error = "Profile photo is required";
        else if (value.size > 1024 * 1024) error = "Photo must be under 1MB";
        else if (!["image/jpeg", "image/jpg", "image/png"].includes(value.type))
          error = "Only JPEG, JPG, PNG allowed";
        break;
      default:
        break;
    }

    return error;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (key !== "fullName") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      newData.fullName =
        `${newData.firstName} ${newData.middleName} ${newData.lastName}`.trim();
      return newData;
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, photo: file }));
    setTouched((prev) => ({ ...prev, photo: true }));

    const error = validateField("photo", file);
    setErrors((prev) => ({ ...prev, photo: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to show errors
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "fullName") allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("middleName", formData.middleName || "");
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("mobileNumber", formData.mobileNumber);
    formDataToSend.append("photo", formData.photo);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("confirmPassword", formData.confirmPassword);

    try {
      await axios.post(
        "https://fir-app-backend-1.onrender.com/api/auth/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Registered successfully");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if a field is valid
  const isValid = (fieldName) => {
    return touched[fieldName] && !errors[fieldName];
  };

  // Check if a field has error
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
        className={`rounded-2xl shadow-xl p-6 max-w-4xl w-full ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold mb-6 text-center"
        >
          Create Your Account
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                First Name *
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
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full p-3 border rounded-lg pl-10 focus:ring-2 focus:outline-none ${
                    hasError("firstName")
                      ? "border-red-500 focus:ring-red-500"
                      : isValid("firstName")
                      ? "border-green-500 focus:ring-green-500"
                      : theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {isValid("firstName") && (
                  <CheckCircleIcon className="h-5 w-5 text-green-500 absolute right-3 top-3" />
                )}
                {hasError("firstName") && (
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500 absolute right-3 top-3" />
                )}
              </div>
              {hasError("firstName") && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Middle Name
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
                  name="middleName"
                  placeholder="Enter middle name"
                  value={formData.middleName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border rounded-lg pl-10 focus:ring-2 focus:outline-none ${
                    hasError("middleName")
                      ? "border-red-500 focus:ring-red-500"
                      : isValid("middleName")
                      ? "border-green-500 focus:ring-green-500"
                      : theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {isValid("middleName") && (
                  <CheckCircleIcon className="h-5 w-5 text-green-500 absolute right-3 top-3" />
                )}
                {hasError("middleName") && (
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500 absolute right-3 top-3" />
                )}
              </div>
              {hasError("middleName") && (
                <p className="mt-1 text-sm text-red-500">{errors.middleName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Last Name *
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
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full p-3 border rounded-lg pl-10 focus:ring-2 focus:outline-none ${
                    hasError("lastName")
                      ? "border-red-500 focus:ring-red-500"
                      : isValid("lastName")
                      ? "border-green-500 focus:ring-green-500"
                      : theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {isValid("lastName") && (
                  <CheckCircleIcon className="h-5 w-5 text-green-500 absolute right-3 top-3" />
                )}
                {hasError("lastName") && (
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500 absolute right-3 top-3" />
                )}
              </div>
              {hasError("lastName") && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>

            {/* Full Name (readonly) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name *
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                readOnly
                className={`w-full p-3 border rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-100 border-gray-300"
                }`}
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Mobile Number *
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <PhoneIcon className="h-5 w-5" />
                </div>
                <input
                  name="mobileNumber"
                  placeholder="Enter 10-digit mobile number"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full p-3 border rounded-lg pl-10 focus:ring-2 focus:outline-none ${
                    hasError("mobileNumber")
                      ? "border-red-500 focus:ring-red-500"
                      : isValid("mobileNumber")
                      ? "border-green-500 focus:ring-green-500"
                      : theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {isValid("mobileNumber") && (
                  <CheckCircleIcon className="h-5 w-5 text-green-500 absolute right-3 top-3" />
                )}
                {hasError("mobileNumber") && (
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500 absolute right-3 top-3" />
                )}
              </div>
              {hasError("mobileNumber") && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.mobileNumber}
                </p>
              )}
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Profile Photo *
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <PhotoIcon className="h-5 w-5" />
                </div>
                <input
                  type="file"
                  name="photo"
                  onChange={handleFileChange}
                  onBlur={handleBlur}
                  accept=".jpg,.jpeg,.png"
                  required
                  className={`w-full p-3 border rounded-lg pl-10 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 ${
                    hasError("photo")
                      ? "border-red-500 focus:ring-red-500"
                      : isValid("photo")
                      ? "border-green-500 focus:ring-green-500"
                      : theme === "dark"
                      ? "file:bg-gray-600 file:text-white bg-gray-700 border-gray-600"
                      : "file:bg-blue-50 file:text-blue-700 bg-white border-gray-300"
                  } file:text-sm file:font-medium focus:ring-2 focus:outline-none focus:ring-blue-500`}
                />
                {isValid("photo") && (
                  <CheckCircleIcon className="h-5 w-5 text-green-500 absolute right-3 top-3" />
                )}
                {hasError("photo") && (
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500 absolute right-3 top-3" />
                )}
              </div>
              {hasError("photo") && (
                <p className="mt-1 text-sm text-red-500">{errors.photo}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Only JPEG, JPG, PNG formats accepted (max 1MB)
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <input
                  name="email"
                  placeholder="Enter email address"
                  type="email"
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

            {/* Password */}
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
                  placeholder="Enter password"
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
              {formData.password && !errors.password && (
                <p className="mt-1 text-xs text-green-500">
                  Password strength: Good
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password *
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
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full p-3 border rounded-lg pl-10 pr-10 focus:ring-2 focus:outline-none ${
                    hasError("confirmPassword")
                      ? "border-red-500 focus:ring-red-500"
                      : isValid("confirmPassword")
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {hasError("confirmPassword") && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
              {formData.confirmPassword && !errors.confirmPassword && (
                <p className="mt-1 text-xs text-green-500">Passwords match</p>
              )}
            </div>
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
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </motion.button>
        </form>

        <p
          className={`text-center mt-6 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Already have an account?{" "}
          <a
            href="/login"
            className={`font-medium ${
              theme === "dark"
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
            } transition-colors`}
          >
            Sign in here
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
