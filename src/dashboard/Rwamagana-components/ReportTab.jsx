import {
  BiChevronDown,
  BiDotsVerticalRounded,
  BiDownload,
} from "react-icons/bi";
import { useState, useEffect } from "react";
import EditReport from "../../authentication/components/EditReeport";
import DeleteReport from "../../authentication/components/DeleteReport";
import { ToastContainer, toast } from "react-toastify";
import { getUserById } from "../../api_service/auth/auth";
import { getReport, getReports } from "../../api_service/report/report";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Import the separated components
import ReportsFilters from "./ReportsFilters";
import ReportsTable from "./ReportsTable2";

const ReportsTab = ({
  handleChange,
  handleSave,
  handleStatusChange,
}) => {
  // Internal state for tab management
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCell, setSelectedCell] = useState("all");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("all");
  const [reports, setReports] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userNames, setUserNames] = useState({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    district: "",
    sector: "",
    cell: "",
    location: "",
    symptoms: "",
    pigsAffected: 0,
  });
  const [editMode, setEditMode] = useState(false);
  const [editingReportId, setEditingReportId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal2, setShowConfirmModal2] = useState(false);

  const availableCells = [
    "Gatare",
    "Karogo",
    "Kadasumbwa",
    "Ruseshe",
    "Nyakaliro",
  ];

  const timeFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "weekly", label: "This Week" },
    { value: "monthly", label: "This Month" },
    { value: "yearly", label: "This Year" },
  ];

  console.log(reports, "all reports");

  useEffect(() => {
    getReports(setReports, setIsLoading);
  }, []);

  // Helper function to filter reports by time
  const filterReportsByTime = (reportsArray, timeFilter) => {
    if (timeFilter === "all") return reportsArray;

    const now = new Date();
    const currentDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    return reportsArray.filter((report) => {
      const reportDate = new Date(report.createdAt);
      const reportDateOnly = new Date(
        reportDate.getFullYear(),
        reportDate.getMonth(),
        reportDate.getDate()
      );

      switch (timeFilter) {
        case "weekly":
          const startOfWeek = new Date(currentDate);
          startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return reportDateOnly >= startOfWeek && reportDateOnly <= endOfWeek;

        case "monthly":
          return (
            reportDate.getMonth() === now.getMonth() &&
            reportDate.getFullYear() === now.getFullYear()
          );

        case "yearly":
          return reportDate.getFullYear() === now.getFullYear();

        default:
          return true;
      }
    });
  };

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

    if (selectedCell !== "all") {
      filteredReports = filteredReports.filter((r) => r.cell === selectedCell);
    }

    filteredReports = filterReportsByTime(filteredReports, selectedTimeFilter);

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

          let userData = null;
          let isLoading = false;

          const setUser = (data) => {
            userData = data;
          };

          const setIsLoading = (loading) => {
            isLoading = loading;
          };

          await getUserById(userId, setUser, setIsLoading);

          console.log("User data received:", userData);

          if (userData && typeof userData === "object") {
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

  // Get report counts for each category
  const getReportCounts = () => {
    if (!reports || !Array.isArray(reports)) {
      return {
        all: 0,
        farmer: 0,
        veterinarian: 0,
      };
    }

    const timeFilteredReports = filterReportsByTime(
      reports,
      selectedTimeFilter
    );

    const cellAndTimeFiltered =
      selectedCell !== "all"
        ? timeFilteredReports.filter((r) => r.cell === selectedCell)
        : timeFilteredReports;

    const allReports = cellAndTimeFiltered;
    const farmerReports = cellAndTimeFiltered.filter(
      (r) => r.senderRole === "farmer"
    );
    const vetReports = cellAndTimeFiltered.filter(
      (r) => r.senderRole === "authority"
    );

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
    {
      key: "veterinarian",
      label: "Veterinarian Reports",
      count: reportCounts.veterinarian,
    },
  ];

  // PDF Download Function
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

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      console.log("PDF document created successfully");

      doc.setFontSize(20);
      doc.text("Reports Export", pageWidth / 2, 20, { align: "center" });

      doc.setFontSize(12);
      let subtitle = `Generated on ${new Date().toLocaleDateString()}`;

      if (activeTab !== "all") {
        subtitle += ` | ${
          activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
        } Reports`;
      }

      if (selectedCell !== "all") {
        subtitle += ` | ${selectedCell} Cell`;
      }

      if (selectedTimeFilter !== "all") {
        const timeFilterLabel = timeFilterOptions.find(
          (option) => option.value === selectedTimeFilter
        )?.label;
        subtitle += ` | ${timeFilterLabel}`;
      }

      subtitle += ` | ${currentReports.length} Reports`;

      doc.text(subtitle, pageWidth / 2, 30, { align: "center" });

      console.log("Headers added successfully");

      const tableColumns = [
        "District",
        "Sector",
        "Cell",
        "Symptoms",
        "Status",
        "Sender Role",
        "Reported By",
        "Created At",
      ];

      const tableRows = currentReports.map((report, index) => {
        try {
          return [
            String(report.district || "N/A"),
            String(report.sector || "N/A"),
            String(report.cell || "N/A"),
            String(
              report.symptoms
                ? report.symptoms.length > 40
                  ? report.symptoms.substring(0, 40) + "..."
                  : report.symptoms
                : "N/A"
            ),
            String(report.status || "N/A"),
            String(report.senderRole || "N/A"),
            String(userNames[report.reportedBy] || "Unknown"),
            String(
              report.createdAt
                ? new Date(report.createdAt).toLocaleDateString()
                : "N/A"
            ),
          ];
        } catch (rowError) {
          console.error(`Error processing row ${index}:`, rowError, report);
          return [
            "Error",
            "Error",
            "Error",
            "Error",
            "Error",
            "Error",
            "Error",
            "Error",
          ];
        }
      });

      console.log("Table data prepared:", tableRows.length, "rows");

      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: "linebreak",
          halign: "left",
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          3: { cellWidth: 40 },
          7: { cellWidth: 25 },
        },
        margin: { top: 40, left: 10, right: 10, bottom: 20 },
        didDrawPage: function (data) {
          doc.setFontSize(10);
          doc.text(
            `Page ${data.pageNumber}`,
            pageWidth - 20,
            doc.internal.pageSize.height - 10,
            { align: "right" }
          );
        },
      });

      console.log("Table added successfully");

      let filename = "reports_export";
      if (activeTab !== "all") {
        filename += `_${activeTab}`;
      }
      if (selectedCell !== "all") {
        filename += `_${selectedCell}`;
      }
      if (selectedTimeFilter !== "all") {
        filename += `_${selectedTimeFilter}`;
      }
      filename += `_${new Date().toISOString().split("T")[0]}.pdf`;

      console.log("Saving PDF with filename:", filename);

      doc.save(filename);

      console.log("PDF saved successfully");
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Detailed PDF generation error:", error);
      console.error("Error stack:", error.stack);

      let errorMessage = "Failed to generate PDF. ";

      if (error.message && error.message.includes("jsPDF")) {
        errorMessage += "PDF library not properly loaded.";
      } else if (error.message && error.message.includes("autoTable")) {
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

        <ReportsFilters
          tabConfigs={tabConfigs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          availableCells={availableCells}
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
          timeFilterOptions={timeFilterOptions}
          selectedTimeFilter={selectedTimeFilter}
          setSelectedTimeFilter={setSelectedTimeFilter}
          downloadPDF={downloadPDF}
          pdfLoading={pdfLoading}
          currentReports={currentReports}
        />

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

        <ReportsTable
          currentReports={currentReports}
          loading={loading}
          userNames={userNames}
          handleStatusChange={handleStatusChange}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          handleEditClick={(report) => {
            setEditForm({
              district: report.district,
              sector: report.sector,
              cell: report.cell,
              location: report.location,
              symptoms: report.symptoms,
              pigsAffected: report.pigsAffected,
            });
            setEditingReportId(report._id);
            setEditMode(true);
          }}
          handleDeleteClick={(reportId) => {
            setSelectedReportId(reportId);
            setShowConfirmModal2(true);
          }}
        />
      </div>

      {showConfirmModal2 && (
        <DeleteReport
          setShowConfirmModal2={setShowConfirmModal2}
          handleDeleteConfirmed2={handleDeleteConfirmed2}
        />
      )}

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