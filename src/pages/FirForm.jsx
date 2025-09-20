import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import {
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  FlagIcon,
  IdentificationIcon,
  BriefcaseIcon,
  PhoneIcon,
  HomeIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";

const FirForm = () => {
  const { theme } = useContext(ThemeContext);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    district: "",
    policeStation: "",
    act: "",
    ipcSections: [],
    generalDiaryRef: "",
    infoType: "",
    placeOccurrence: "",
    complainantName: "",
    complainantDob: "",
    complainantNationality: "",
    complainantAadhaar: "",
    complainantOccupation: "",
    complainantMobile: "",
    complainantAddress: "",
    suspectName: "",
    suspectAddress: "",
    enquiryOfficerName: "",
    enquiryOfficerRank: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchFir();
    }
  }, [id]);

  const fetchFir = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/fir/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFormData(res.data);
    } catch (err) {
      toast.error("Error fetching data");
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "district":
        if (!value.trim()) error = "District is required";
        break;
      case "policeStation":
        if (!value) error = "Police station is required";
        break;
      case "act":
        if (!value.trim()) error = "ACT is required";
        break;
      case "ipcSections":
        if (value.length === 0)
          error = "At least one IPC section must be selected";
        break;
      case "generalDiaryRef":
        if (!value.trim()) error = "General diary reference is required";
        else if (!/^[A-Z0-9/-]+$/.test(value))
          error = "Invalid reference format";
        break;
      case "infoType":
        if (!value) error = "Information type is required";
        break;
      case "placeOccurrence":
        if (!value.trim()) error = "Place of occurrence is required";
        break;
      case "complainantName":
        if (!value.trim()) error = "Complainant name is required";
        else if (value.length < 3) error = "Name must be at least 3 characters";
        break;
      case "complainantDob":
        if (!value) error = "Date of birth is required";
        else {
          const dob = new Date(value);
          const today = new Date();
          if (dob >= today) error = "Date of birth must be in the past";
        }
        break;
      case "complainantNationality":
        if (!value.trim()) error = "Nationality is required";
        break;
      case "complainantAadhaar":
        if (!value.trim()) error = "Aadhaar number is required";
        else if (!/^\d{12}$/.test(value)) error = "Aadhaar must be 12 digits";
        break;
      case "complainantOccupation":
        if (!value.trim()) error = "Occupation is required";
        break;
      case "complainantMobile":
        if (!value.trim()) error = "Mobile number is required";
        else if (!/^[6-9]\d{9}$/.test(value)) error = "Invalid mobile number";
        break;
      case "complainantAddress":
        if (!value.trim()) error = "Address is required";
        else if (value.length < 10)
          error = "Address must be at least 10 characters";
        break;
      case "suspectName":
        if (!value.trim()) error = "Suspect name is required";
        break;
      case "suspectAddress":
        if (!value.trim()) error = "Suspect address is required";
        break;
      case "enquiryOfficerName":
        if (!value.trim()) error = "Enquiry officer name is required";
        break;
      case "enquiryOfficerRank":
        if (!value) error = "Enquiry officer rank is required";
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        ipcSections: checked
          ? [...prev.ipcSections, value]
          : prev.ipcSections.filter((sec) => sec !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBlur = (e) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") return; // Skip validation for checkboxes on blur

    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (key === "ipcSections") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      } else if (formData[key] === "" || formData[key] === null) {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      if (id) {
        await axios.put(`http://localhost:8080/api/fir/${id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("FIR updated successfully");
      } else {
        await axios.post("http://localhost:8080/api/fir", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("FIR created successfully");
      }
      navigate("/report");
    } catch (err) {
      toast.error("Error submitting form");
    }
  };

  const policeStations = ["Station A", "Station B", "Station C"];
  const infoTypes = ["Public Informed", "Victim Informed", "Criminal Informed"];
  const ranks = ["Constable", "Head Constable", "ASI", "PSI", "API", "PI"];
  const ipcOptions = ["1860", "373", "353", "420", "302"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen py-8 px-4 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`rounded-2xl shadow-xl p-6 max-w-4xl w-full mx-auto ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h1
          className={`text-3xl font-bold mb-6 text-center ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          FIR Form
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* District */}
          <div className="relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              District
            </label>
            <div className="relative">
              <BuildingOfficeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                name="district"
                placeholder="Enter district"
                value={formData.district}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg pl-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.district ? "border-red-500" : ""}`}
              />
            </div>
            {errors.district && (
              <p className="mt-1 text-sm text-red-500">{errors.district}</p>
            )}
          </div>

          {/* Police Station */}
          <div className="relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Police Station
            </label>
            <div className="relative">
              <ShieldCheckIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                name="policeStation"
                value={formData.policeStation}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg pl-10 appearance-none ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.policeStation ? "border-red-500" : ""}`}
              >
                <option value="">Select Police Station</option>
                {policeStations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>
            {errors.policeStation && (
              <p className="mt-1 text-sm text-red-500">
                {errors.policeStation}
              </p>
            )}
          </div>

          {/* ACT */}
          <div className="relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              ACT
            </label>
            <div className="relative">
              <DocumentTextIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                name="act"
                placeholder="Enter ACT"
                value={formData.act}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg pl-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.act ? "border-red-500" : ""}`}
              />
            </div>
            {errors.act && (
              <p className="mt-1 text-sm text-red-500">{errors.act}</p>
            )}
          </div>

          {/* IPC Sections */}
          <div className="relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              IPC Sections
            </label>
            <div className="relative">
              <BookOpenIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <div
                className={`grid grid-cols-2 gap-2 p-3 border rounded-lg pl-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } ${errors.ipcSections ? "border-red-500" : ""}`}
              >
                {ipcOptions.map((sec) => (
                  <label
                    key={sec}
                    className={`flex items-center ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={sec}
                      checked={formData.ipcSections.includes(sec)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Section {sec}
                  </label>
                ))}
              </div>
            </div>
            {errors.ipcSections && (
              <p className="mt-1 text-sm text-red-500">{errors.ipcSections}</p>
            )}
          </div>

          {/* General Diary Reference Number */}
          <div className="relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              General Diary Reference Number
            </label>
            <div className="relative">
              <HashtagIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                name="generalDiaryRef"
                placeholder="Enter reference number"
                value={formData.generalDiaryRef}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg pl-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.generalDiaryRef ? "border-red-500" : ""}`}
              />
            </div>
            {errors.generalDiaryRef && (
              <p className="mt-1 text-sm text-red-500">
                {errors.generalDiaryRef}
              </p>
            )}
          </div>

          {/* Type of Information */}
          <div className="relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Type of Information
            </label>
            <div className="relative">
              <InformationCircleIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                name="infoType"
                value={formData.infoType}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg pl-10 appearance-none ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.infoType ? "border-red-500" : ""}`}
              >
                <option value="">Select Information Type</option>
                {infoTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {errors.infoType && (
              <p className="mt-1 text-sm text-red-500">{errors.infoType}</p>
            )}
          </div>

          {/* Place of Occurrence */}
          <div className="md:col-span-2 relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Place of Occurrence
            </label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                name="placeOccurrence"
                placeholder="Enter place of occurrence"
                value={formData.placeOccurrence}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg pl-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.placeOccurrence ? "border-red-500" : ""}`}
              />
            </div>
            {errors.placeOccurrence && (
              <p className="mt-1 text-sm text-red-500">
                {errors.placeOccurrence}
              </p>
            )}
          </div>

          {/* Complainant Section */}
          <div className="md:col-span-2">
            <h2
              className={`text-xl font-semibold mt-6 mb-4 pb-2 border-b ${
                theme === "dark"
                  ? "text-white border-gray-700"
                  : "text-gray-800 border-gray-300"
              }`}
            >
              Complainant Information
            </h2>
          </div>

          {/* Complainant Name */}
          <div className="relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Complainant Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                name="complainantName"
                placeholder="Enter complainant name"
                value={formData.complainantName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg pl-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.complainantName ? "border-red-500" : ""}`}
              />
            </div>
            {errors.complainantName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.complainantName}
              </p>
            )}
          </div>

          {/* Complainant Date of Birth */}
          <div className="relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Date of Birth
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                name="complainantDob"
                type="date"
                value={formData.complainantDob}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg pl-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.complainantDob ? "border-red-500" : ""}`}
              />
            </div>
            {errors.complainantDob && (
              <p className="mt-1 text-sm text-red-500">
                {errors.complainantDob}
              </p>
            )}
          </div>

          {/* Complainant Nationality */}
          <div className="relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Nationality
            </label>
            <div className="relative">
              <FlagIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                name="complainantNationality"
                placeholder="Enter nationality"
                value={formData.complainantNationality}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg pl-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.complainantNationality ? "border-red-500" : ""}`}
              />
            </div>
            {errors.complainantNationality && (
              <p className="mt-1 text-sm text-red-500">
                {errors.complainantNationality}
              </p>
            )}
          </div>

          {/* Complainant Aadhaar Number */}
          <div className="relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Aadhaar Number
            </label>
            <div className="relative">
              <IdentificationIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                name="complainantAadhaar"
                placeholder="Enter Aadhaar number"
                value={formData.complainantAadhaar}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg pl-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.complainantAadhaar ? "border-red-500" : ""}`}
              />
            </div>
            {errors.complainantAadhaar && (
              <p className="mt-1 text-sm text-red-500">
                {errors.complainantAadhaar}
              </p>
            )}
          </div>

          {/* Complainant Occupation */}
          <div className="relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Occupation
            </label>
            <div className="relative">
              <BriefcaseIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                name="complainantOccupation"
                placeholder="Enter occupation"
                value={formData.complainantOccupation}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg pl-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.complainantOccupation ? "border-red-500" : ""}`}
              />
            </div>
            {errors.complainantOccupation && (
              <p className="mt-1 text-sm text-red-500">
                {errors.complainantOccupation}
              </p>
            )}
          </div>

          {/* Complainant Mobile Number */}
          <div className="relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Mobile Number
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                name="complainantMobile"
                placeholder="Enter mobile number"
                type="tel"
                value={formData.complainantMobile}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg pl-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.complainantMobile ? "border-red-500" : ""}`}
              />
            </div>
            {errors.complainantMobile && (
              <p className="mt-1 text-sm text-red-500">
                {errors.complainantMobile}
              </p>
            )}
          </div>

          {/* Complainant Address */}
          <div className="md:col-span-2 relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Address
            </label>
            <div className="relative">
              <HomeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                name="complainantAddress"
                placeholder="Enter complete address"
                value={formData.complainantAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={3}
                className={`w-full p-3 border rounded-lg pl-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.complainantAddress ? "border-red-500" : ""}`}
              />
            </div>
            {errors.complainantAddress && (
              <p className="mt-1 text-sm text-red-500">
                {errors.complainantAddress}
              </p>
            )}
          </div>

          {/* Suspect Section */}
          <div className="md:col-span-2">
            <h2
              className={`text-xl font-semibold mt-6 mb-4 pb-2 border-b ${
                theme === "dark"
                  ? "text-white border-gray-700"
                  : "text-gray-800 border-gray-300"
              }`}
            >
              Suspect Information
            </h2>
          </div>

          {/* Suspect Name */}
          <div className="relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Suspect Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                name="suspectName"
                placeholder="Enter suspect name"
                value={formData.suspectName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg pl-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.suspectName ? "border-red-500" : ""}`}
              />
            </div>
            {errors.suspectName && (
              <p className="mt-1 text-sm text-red-500">{errors.suspectName}</p>
            )}
          </div>

          {/* Suspect Address */}
          <div className="md:col-span-2 relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Suspect Address
            </label>
            <div className="relative">
              <HomeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                name="suspectAddress"
                placeholder="Enter suspect address"
                value={formData.suspectAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={3}
                className={`w-full p-3 border rounded-lg pl-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.suspectAddress ? "border-red-500" : ""}`}
              />
            </div>
            {errors.suspectAddress && (
              <p className="mt-1 text-sm text-red-500">
                {errors.suspectAddress}
              </p>
            )}
          </div>

          {/* Enquiry Officer Section */}
          <div className="md:col-span-2">
            <h2
              className={`text-xl font-semibold mt-6 mb-4 pb-2 border-b ${
                theme === "dark"
                  ? "text-white border-gray-700"
                  : "text-gray-800 border-gray-300"
              }`}
            >
              Enquiry Officer Information
            </h2>
          </div>

          {/* Enquiry Officer Name */}
          <div className="relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Enquiry Officer Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                name="enquiryOfficerName"
                placeholder="Enter officer name"
                value={formData.enquiryOfficerName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg pl-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.enquiryOfficerName ? "border-red-500" : ""}`}
              />
            </div>
            {errors.enquiryOfficerName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.enquiryOfficerName}
              </p>
            )}
          </div>

          {/* Enquiry Officer Rank */}
          <div className="relative">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Enquiry Officer Rank
            </label>
            <div className="relative">
              <ClipboardDocumentListIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                name="enquiryOfficerRank"
                value={formData.enquiryOfficerRank}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg pl-10 appearance-none ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } ${errors.enquiryOfficerRank ? "border-red-500" : ""}`}
              >
                <option value="">Select Rank</option>
                {ranks.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </div>
            {errors.enquiryOfficerRank && (
              <p className="mt-1 text-sm text-red-500">
                {errors.enquiryOfficerRank}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors duration-200"
            >
              {id ? "Update FIR" : "Submit FIR"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default FirForm;
