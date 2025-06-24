import { BiChevronDown, BiDotsVerticalRounded, BiDownload } from "react-icons/bi";
import { useState, useEffect } from "react";
import EditReport from "../../authentication/components/EditReeport";
import DeleteReport from "../../authentication/components/DeleteReport";
import { ToastContainer, toast } from "react-toastify";
import { getUserById } from "../../api_service/auth/auth";
import { getReport, getReports } from "../../api_service/report/report";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportsTab = ({
  editMode,
  setEditMode,
  editingReportId,
  editForm,
  handleChange,
  handleSave,
  handleStatusChange,
  handleEditClick,
  showConfirmModal2,
  setShowConfirmModal2,
  setSelectedReportId,
  handleDeleteConfirmed2,
}) => {
  // Internal state for tab management
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCell, setSelectedCell] = useState("all");
  const [reports, setReports] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userNames, setUserNames] = useState({}); // Store user names by ID
  const [pdfLoading, setPdfLoading] = useState(false);

  const availableCells = [
    "Gatare",
    "Karogo",
    "Kadasumbwa",
    "Ruseshe",
    "Nyakaliro",
  ];

  console.log(reports, "all reports");

  useEffect(() => {
    getReports(setReports, setIsLoading);
  }, []);

  const getFilteredReports = () => {
    if (!reports || !Array.isArray(reports)) {
      return [];
    }

    let filteredReports = [];

    switch (activeTab) {
      case "all":
        filteredReports = reports;
        break;
      case "farmer":
        filteredReports = reports.filter((r) => r.senderRole === "farmer");
        break;
      case "veterinarian":
        filteredReports = reports.filter((r) => r.senderRole === "authority");
        break;
      default:
        filteredReports = reports;
    }

    // Apply cell filter if not "all"
    if (selectedCell !== "all") {
      filteredReports = filteredReports.filter((r) => r.cell === selectedCell);
    }

    return filteredReports;
  };

  const currentReports = getFilteredReports();

  useEffect(() => {
    const fetchUserNames = async () => {
      const uniqueUserIds = [
        ...new Set(currentReports.map((r) => r.reportedBy)),
      ];
      console.log("Unique User IDs to fetch:", uniqueUserIds);
      const names = {};

      for (const userId of uniqueUserIds) {
        if (!userId) {
          console.log("Skipping undefined/null userId");
          continue;
        }

        try {
          console.log(`Fetching user with ID: ${userId}`);

          // Create promises for setUser and setIsLoading callbacks
          let userData = null;
          let isLoading = false;

          const setUser = (data) => {
            userData = data;
          };

          const setIsLoading = (loading) => {
            isLoading = loading;
          };

          // Call getUserById with the required parameters
          await getUserById(userId, setUser, setIsLoading);

          console.log("User data received:", userData);

          if (userData && typeof userData === "object") {
            // Try different possible field names for firstName
            const firstName =
              userData.firstName ||
              userData.first_name ||
              userData.name ||
              userData.username ||
              userData.email;
            names[userId] = firstName || `User-${userId.slice(-4)}`;
            console.log(`Set name for ${userId}:`, names[userId]);
          } else {
            console.log(`Invalid user data for ${userId}:`, userData);
            names[userId] = `User-${userId.slice(-4)}`;
          }
        } catch (error) {
          console.error(`Error fetching user with ID ${userId}:`, error);
          names[userId] = `Error-${userId.slice(-4)}`;
        }
      }

      console.log("Final userNames object:", names);
      setUserNames(names);
    };

    if (currentReports.length > 0) {
      fetchUserNames();
    }
  }, [currentReports]);

  const toggleDropdown = (reportId) => {
    setOpenDropdown(openDropdown === reportId ? null : reportId);
  };

  const handleActionClick = (action, report) => {
    setOpenDropdown(null); // Close dropdown after action

    switch (action) {
      case "edit":
        handleEditClick(report);
        break;
      case "delete":
        setSelectedReportId(report._id);
        setShowConfirmModal2(true);
        break;
      default:
        break;
    }
  };

  // Get report counts for each category
  const getReportCounts = () => {
    // Safety check: return zeros if reports is undefined or null
    if (!reports || !Array.isArray(reports)) {
      return {
        all: 0,
        farmer: 0,
        veterinarian: 0,
      };
    }

    const allReports = reports;
    const farmerReports = reports.filter((r) => r.senderRole === "farmer");
    const vetReports = reports.filter((r) => r.senderRole === "authority");

    return {
      all: allReports.length,
      farmer: farmerReports.length,
      veterinarian: vetReports.length,
    };
  };

  const reportCounts = getReportCounts();

  // Tab configuration
  const tabConfigs = [
    { key: "all", label: "All Reports", count: reportCounts.all },
    { key: "farmer", label: "Farmer Reports", count: reportCounts.farmer },
    { key: "veterinarian", label: "Veterinarian Reports", count: reportCounts.veterinarian },
  ];

  // Fixed PDF Download Function
  const downloadPDF = async () => {
    if (currentReports.length === 0) {
      toast.error("No reports to download!");
      return;
    }

    setPdfLoading(true);
    
    try {
      console.log("Starting PDF generation...");
      console.log("Current reports:", currentReports);
      console.log("User names:", userNames);
      
      // Create new PDF document
      const doc = new jsPDF();
      
      // Set up the document
      const pageWidth = doc.internal.pageSize.width;
      
      console.log("PDF document created successfully");
      
      // Title
      doc.setFontSize(20);
      doc.text("Reports Export", pageWidth / 2, 20, { align: "center" });
      
      // Subtitle with filter information
      doc.setFontSize(12);
      let subtitle = `Generated on ${new Date().toLocaleDateString()}`;
      
      if (activeTab !== "all") {
        subtitle += ` | ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Reports`;
      }
      
      if (selectedCell !== "all") {
        subtitle += ` | ${selectedCell} Cell`;
      }
      
      subtitle += ` | ${currentReports.length} Reports`;
      
      doc.text(subtitle, pageWidth / 2, 30, { align: "center" });
      
      console.log("Headers added successfully");
      
      // Prepare table data with better error handling
      const tableColumns = [
        "District",
        "Sector", 
        "Cell",
        "Symptoms",
        "Status",
        "Sender Role",
        "Reported By",
        "Created At"
      ];
      
      const tableRows = currentReports.map((report, index) => {
        try {
          return [
            String(report.district || "N/A"),
            String(report.sector || "N/A"),
            String(report.cell || "N/A"),
            String(report.symptoms ? 
              (report.symptoms.length > 40 ? report.symptoms.substring(0, 40) + "..." : report.symptoms) 
              : "N/A"),
            String(report.status || "N/A"),
            String(report.senderRole || "N/A"),
            String(userNames[report.reportedBy] || "Unknown"),
            String(report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "N/A")
          ];
        } catch (rowError) {
          console.error(`Error processing row ${index}:`, rowError, report);
          return ["Error", "Error", "Error", "Error", "Error", "Error", "Error", "Error"];
        }
      });
      
      console.log("Table data prepared:", tableRows.length, "rows");
      
      // Add table using autoTable
      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
          halign: 'left'
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          3: { cellWidth: 40 }, // Symptoms column
          7: { cellWidth: 25 }  // Created At column
        },
        margin: { top: 40, left: 10, right: 10, bottom: 20 },
        didDrawPage: function (data) {
          // Add page numbers
          doc.setFontSize(10);
          doc.text(
            `Page ${data.pageNumber}`,
            pageWidth - 20,
            doc.internal.pageSize.height - 10,
            { align: 'right' }
          );
        }
      });
      
      console.log("Table added successfully");
      
      // Generate filename
      let filename = "reports_export";
      if (activeTab !== "all") {
        filename += `_${activeTab}`;
      }
      if (selectedCell !== "all") {
        filename += `_${selectedCell}`;
      }
      filename += `_${new Date().toISOString().split('T')[0]}.pdf`;
      
      console.log("Saving PDF with filename:", filename);
      
      // Save the PDF
      doc.save(filename);
      
      console.log("PDF saved successfully");
      toast.success("PDF downloaded successfully!");
      
    } catch (error) {
      console.error("Detailed PDF generation error:", error);
      console.error("Error stack:", error.stack);
      
      let errorMessage = "Failed to generate PDF. ";
      
      if (error.message && error.message.includes('jsPDF')) {
        errorMessage += "PDF library not properly loaded.";
      } else if (error.message && error.message.includes('autoTable')) {
        errorMessage += "PDF table plugin not loaded.";
      } else {
        errorMessage += "Please check console for details.";
      }
      
      toast.error(errorMessage);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-sm">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <ToastContainer />

        {/* Report Type Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tabConfigs.map((tab) => (
            <button
              key={tab.key}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter and Download Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Cell Filter Dropdown */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Cell
            </label>
            <div className="relative w-full sm:w-64">
              <select
                value={selectedCell}
                onChange={(e) => setSelectedCell(e.target.value)}
                className="w-full px-4 py-2 pr-8 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="all">All Cells</option>
                {availableCells.map((cell) => (
                  <option key={cell} value={cell}>
                    {cell}
                  </option>
                ))}
              </select>
              <BiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* PDF Download Button */}
          <div className="flex items-end">
            <button
              onClick={downloadPDF}
              disabled={pdfLoading || currentReports.length === 0}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200
                ${pdfLoading || currentReports.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                }
              `}
            >
              {pdfLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <BiDownload className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {currentReports.length}
            </span>{" "}
            reports
            {activeTab !== "all" && (
              <span>
                {" "}
                from{" "}
                <span className="font-semibold text-blue-600">
                  {activeTab}s
                </span>
              </span>
            )}
            {selectedCell !== "all" && (
              <span>
                {" "}
                in{" "}
                <span className="font-semibold text-green-600">
                  {selectedCell}
                </span>{" "}
                cell
              </span>
            )}
          </p>
        </div>

        {editMode && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <EditReport
              reportId={editingReportId}
              editForm={editForm}
              onChange={handleChange}
              onSave={handleSave}
              onCancel={() => setEditMode(false)}
            />
          </div>
        )}

        {/* Reports Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    District
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cell
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Symptoms
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sender Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reported By
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-lg font-medium text-gray-900 mb-1">
                          Loading reports...
                        </p>
                        <p className="text-sm text-gray-500">
                          Please wait while we fetch the data
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : currentReports.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 mb-4 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-lg font-medium text-gray-900 mb-1">
                          No reports found
                        </p>
                        <p className="text-sm text-gray-500">
                          No reports match your current filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentReports.map((r, index) => (
                    <tr
                      key={r._id}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {r.district}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {r.sector}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {r.cell}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {r.symptoms}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap relative">
                        <select
                          value={r.status}
                          onChange={(e) =>
                            handleStatusChange(r._id, e.target.value)
                          }
                          className={`
                            inline-flex items-center px-2.5 py-0.5 pr-6 rounded-full text-xs font-medium 
                            border border-opacity-50 cursor-pointer outline-none appearance-none
                            focus:ring-2 focus:ring-offset-1 transition-all duration-200 
                            ${
                              r.status === "resolved"
                                ? "bg-green-100 text-green-800 border-green-300 focus:ring-green-300"
                                : r.status === "received"
                                ? "bg-blue-100 text-blue-800 border-blue-300 focus:ring-blue-300"
                                : "bg-yellow-100 text-yellow-800 border-yellow-300 focus:ring-yellow-300"
                            }
                          `}
                        >
                          <option value="pending">Pending</option>
                          <option value="received">Received</option>
                          <option value="resolved">Resolved</option>
                        </select>

                        <BiChevronDown
                          className={`
                            absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none
                            ${
                              r.status === "resolved"
                                ? "text-green-600"
                                : r.status === "received"
                                ? "text-blue-600"
                                : "text-yellow-600"
                            }
                          `}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            r.senderRole === "farmer"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {r.senderRole}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {userNames[r.reportedBy] || "Loading..."}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="relative">
                          {/* More Actions Button */}
                          <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => toggleDropdown(r._id)}
                          >
                            <BiDotsVerticalRounded className="w-5 h-5 text-gray-600" />
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdown === r._id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                              <div className="py-1">
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                                  onClick={() => handleActionClick("edit", r)}
                                >
                                  <svg
                                    className="w-4 h-4 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  Edit
                                </button>

                                <div className="border-t border-gray-100"></div>

                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                  onClick={() => handleActionClick("delete", r)}
                                >
                                  <svg
                                    className="w-4 h-4 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showConfirmModal2 && (
        <DeleteReport
          setShowConfirmModal2={setShowConfirmModal2}
          handleDeleteConfirmed2={handleDeleteConfirmed2}
        />
      )}

      {/* Click outside to close dropdown */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenDropdown(null)}
        ></div>
      )}
    </div>
  );
};

export default ReportsTab;