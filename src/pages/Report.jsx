import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ThemeContext } from "../context/ThemeContext";
import {
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  XMarkIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const Report = () => {
  const { theme } = useContext(ThemeContext);
  const [firs, setFirs] = useState([]);
  const [filteredFirs, setFilteredFirs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [selectedFir, setSelectedFir] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFirs();
  }, []);

  useEffect(() => {
    const filtered = firs.filter((fir) =>
      Object.values(fir).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredFirs(filtered);
    setCurrentPage(1);
  }, [firs, searchTerm]);

  const fetchFirs = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/fir", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFirs(res.data);
    } catch (err) {
      toast.error("Error fetching reports");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FIR?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/fir/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("FIR deleted successfully");
      fetchFirs();
    } catch (err) {
      toast.error("Error deleting FIR");
    }
  };

  const handleExcelExport = () => {
    setIsExporting(true);
    try {
      const data = firs.map((fir) => ({
        "FIR Number": fir.firNumber || "",
        District: fir.district || "",
        "Police Station": fir.policeStation || "",
        ACT: fir.act || "",
        "IPC Sections": fir.ipcSections?.join(", ") || "",
        "Date & Time": fir.dateTime
          ? new Date(fir.dateTime).toLocaleString()
          : "",
        "General Diary Ref": fir.generalDiaryRef || "",
        "Info Type": fir.infoType || "",
        "Place of Occurrence": fir.placeOccurrence || "",
        "Complainant Name": fir.complainantName || "",
        "Complainant DOB": fir.complainantDob || "",
        "Complainant Nationality": fir.complainantNationality || "",
        "Complainant Aadhaar": fir.complainantAadhaar || "",
        "Complainant Occupation": fir.complainantOccupation || "",
        "Complainant Mobile": fir.complainantMobile || "",
        "Complainant Address": fir.complainantAddress || "",
        "Suspect Name": fir.suspectName || "N/A",
        "Suspect Address": fir.suspectAddress || "N/A",
        "Enquiry Officer Name": fir.enquiryOfficerName || "",
        "Enquiry Officer Rank": fir.enquiryOfficerRank || "",
      }));
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "FIRs");
      XLSX.writeFile(workbook, "firs.xlsx");
      setTimeout(() => {
        toast.success("Excel file downloaded successfully");
        setIsExporting(false);
      }, 500);
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Error exporting to Excel");
      setIsExporting(false);
    }
  };

  const handlePDFExport = () => {
    setIsExporting(true);
    if (!firs.length) {
      toast.error("No data available to export to PDF");
      setIsExporting(false);
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: "landscape", // 👈 this is key
        unit: "pt", // points
        format: "a4",
      });

      doc.setFontSize(18);
      doc.text("FIR Reports", 40, 30);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(
        `Generated on: ${new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })}`,
        40,
        45
      );

      const tableData = firs.map((fir) => [
        fir.firNumber || "",
        fir.district || "",
        fir.policeStation || "",
        fir.act || "",
        fir.ipcSections?.join(", ") || "",
        fir.dateTime ? new Date(fir.dateTime).toLocaleString() : "",
        fir.generalDiaryRef || "",
        fir.infoType || "",
        fir.placeOccurrence || "",
        fir.complainantName || "",
        fir.complainantDob || "",
        fir.complainantNationality || "",
        fir.complainantAadhaar || "",
        fir.complainantOccupation || "",
        fir.complainantMobile || "",
        fir.complainantAddress || "",
        fir.suspectName || "N/A",
        fir.suspectAddress || "N/A",
        fir.enquiryOfficerName || "",
        fir.enquiryOfficerRank || "",
      ]);

      // headings
const headers = [
  "FIR No",
  "District",
  "Police Station",
  "ACT",
  "IPC Sections",
  "Date & Time",
  "General Diary Ref",
  "Info Type",
  "Place of Occurrence",
  "Complainant Name",
  "Complainant DOB",
  "Complainant Nationality",
  "Complainant Aadhaar",
  "Complainant Occupation",
  "Complainant Mobile",
  "Complainant Address",
  "Suspect Name",
  "Suspect Address",
  "Enquiry Officer Name",
  "Enquiry Officer Rank",
];

// split headers & data into two sets of 10 columns
const firstHalfHeaders = headers.slice(0, 10);
const secondHalfHeaders = headers.slice(10);

const firstHalfData = tableData.map(r => r.slice(0, 10));
const secondHalfData = tableData.map(r => r.slice(10));

// first page
autoTable(doc, {
  head: [firstHalfHeaders],
  body: firstHalfData,
  startY: 60,
  theme: "grid",
  tableWidth: "auto", // fill page width
  styles: {
    fontSize: 7,
    cellPadding: 3,
    cellWidth: "auto",       // each column shares width
    overflow: "linebreak",
  },
  headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
  alternateRowStyles: { fillColor: [240, 240, 240] },
  margin: { top: 60, left: 40, right: 40 },
});

// second page
doc.addPage("landscape");
autoTable(doc, {
  head: [secondHalfHeaders],
  body: secondHalfData,
  startY: 60,
  theme: "grid",
  tableWidth: "auto",
  styles: {
    fontSize: 7,
    cellPadding: 3,
    cellWidth: "auto",
    overflow: "linebreak",
  },
  headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
  alternateRowStyles: { fillColor: [240, 240, 240] },
  margin: { top: 60, left: 40, right: 40 },
});


      doc.save("firs_report.pdf");
      toast.success("PDF file downloaded successfully");
      setIsExporting(false);
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Error exporting to PDF");
      setIsExporting(false);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredFirs].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setFilteredFirs(sortedData);
  };

  const viewFirDetails = (fir) => {
    setSelectedFir(fir);
    setIsModalOpen(true);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const tableHeaders = [
    { key: "firNumber", label: "FIR No", showMobile: true },
    { key: "district", label: "District", showMobile: false },
    { key: "policeStation", label: "Police Station", showMobile: false },
    { key: "complainantName", label: "Complainant", showMobile: true },
    { key: "dateTime", label: "Date", showMobile: true },
    { key: "actions", label: "Actions", showMobile: true },
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFirs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFirs.length / itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 md:p-8 w-full transition-colors duration-300"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0 transition-colors">
          FIR Reports
        </h1>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search FIRs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExcelExport}
              disabled={isExporting}
              className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 md:px-4 rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-1 md:mr-2" />
                </motion.div>
              ) : (
                <>
                  <ArrowDownTrayIcon className="h-5 w-5 mr-1 md:mr-2" />
                  <span className="hidden md:inline">Excel</span>
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePDFExport}
              disabled={isExporting}
              className="flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 md:px-4 rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <DocumentTextIcon className="h-5 w-5 mr-1 md:mr-2" />
                </motion.div>
              ) : (
                <>
                  <DocumentTextIcon className="h-5 w-5 mr-1 md:mr-2" />
                  <span className="hidden md:inline">PDF</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {filteredFirs.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 transition-colors">
          {searchTerm ? "No matching FIRs found" : "No FIRs available"}
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded-lg shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 transition-colors">
                  {tableHeaders.map((header) => (
                    <th
                      key={header.key}
                      className="p-3 text-left text-gray-700 dark:text-gray-300 font-semibold cursor-pointer transition-colors"
                      onClick={() =>
                        header.key !== "actions" && handleSort(header.key)
                      }
                    >
                      <div className="flex items-center">
                        {header.label}
                        {header.key !== "actions" && (
                          <ChevronUpDownIcon className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((fir) => (
                  <tr
                    key={fir.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-3 text-gray-800 dark:text-gray-200 transition-colors">
                      {fir.firNumber}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 transition-colors">
                      {fir.district}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 transition-colors">
                      {fir.policeStation}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 transition-colors">
                      {fir.complainantName}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 transition-colors">
                      {new Date(fir.dateTime).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewFirDetails(fir)}
                          className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/form/${fir.id}`)}
                          className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(fir.id)}
                          className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {currentItems.map((fir) => (
              <div
                key={fir.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white transition-colors">
                      {fir.firNumber}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors">
                      {fir.district} • {fir.policeStation}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                    {new Date(fir.dateTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-gray-700 dark:text-gray-300 transition-colors">
                    <span className="font-medium">Complainant:</span>{" "}
                    {fir.complainantName}
                  </p>
                  {fir.suspectName && (
                    <p className="text-gray-700 dark:text-gray-300 transition-colors">
                      <span className="font-medium">Suspect:</span>{" "}
                      {fir.suspectName}
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => viewFirDetails(fir)}
                    className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/form/${fir.id}`)}
                    className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(fir.id)}
                    className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {isModalOpen && selectedFir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-colors"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">
                FIR Details - {selectedFir.firNumber}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2 transition-colors">
                  FIR Information
                </h3>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">District:</span>{" "}
                  {selectedFir.district || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">Police Station:</span>{" "}
                  {selectedFir.policeStation || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">ACT:</span>{" "}
                  {selectedFir.act || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">IPC Sections:</span>{" "}
                  {selectedFir.ipcSections?.join(", ") || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">Date & Time:</span>{" "}
                  {selectedFir.dateTime
                    ? new Date(selectedFir.dateTime).toLocaleString()
                    : "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">General Diary Ref:</span>{" "}
                  {selectedFir.generalDiaryRef || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">Info Type:</span>{" "}
                  {selectedFir.infoType || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">Place of Occurrence:</span>{" "}
                  {selectedFir.placeOccurrence || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2 transition-colors">
                  Complainant Details
                </h3>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">Name:</span>{" "}
                  {selectedFir.complainantName || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">DOB:</span>{" "}
                  {selectedFir.complainantDob || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">Nationality:</span>{" "}
                  {selectedFir.complainantNationality || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">Aadhaar:</span>{" "}
                  {selectedFir.complainantAadhaar || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">Occupation:</span>{" "}
                  {selectedFir.complainantOccupation || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">Mobile:</span>{" "}
                  {selectedFir.complainantMobile || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">Address:</span>{" "}
                  {selectedFir.complainantAddress || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2 transition-colors">
                  Suspect Details
                </h3>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">Name:</span>{" "}
                  {selectedFir.suspectName || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">Address:</span>{" "}
                  {selectedFir.suspectAddress || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2 transition-colors">
                  Enquiry Officer
                </h3>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">Name:</span>{" "}
                  {selectedFir.enquiryOfficerName || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="font-medium">Rank:</span>{" "}
                  {selectedFir.enquiryOfficerRank || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Report;
