import { FiEdit, FiTrash2 } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";
import { useState } from "react";

const ReportsTable = ({ 
  reports, 
  showActions = true, 
  onEdit, 
  onDelete, 
  onToggleReplies,
  expandedReports = [],
  showRepliesButton = true 
}) => {
  // State for filtering
  const [reportTypeFilter, setReportTypeFilter] = useState("all");
  const [selectedCell, setSelectedCell] = useState("all");

  // Available cells for filtering
  const availableCells = ["Gatare", "Karogo", "Kadasumbwa", "Ruseshe", "Nyakaliro"];

  // Filter reports based on selected filters
  const getFilteredReports = () => {
    let filteredReports = [];
    
    // Filter by report type (sender role)
    switch (reportTypeFilter) {
      case "all":
        filteredReports = reports;
        break;
      case "farmer":
        filteredReports = reports.filter((r) => r.senderRole === "farmer");
        break;
      case "veterinarian":
        filteredReports = reports.filter((r) => r.senderRole === "veterinarian");
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

  const filteredReports = getFilteredReports();

  // Get report counts for each category
  const getReportCounts = () => {
    const allReports = reports;
    const farmerReports = reports.filter((r) => r.senderRole === "farmer");
    const vetReports = reports.filter((r) => r.senderRole === "veterinarian");
    
    return {
      all: allReports.length,
      farmer: farmerReports.length,
      veterinarian: vetReports.length
    };
  };

  const reportCounts = getReportCounts();

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Report Type Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: "all", label: "All Reports", count: reportCounts.all },
            { key: "farmer", label: "Farmer Reports", count: reportCounts.farmer },
            { key: "veterinarian", label: "Veterinarian Reports", count: reportCounts.veterinarian }
          ].map((tab) => (
            <button
              key={tab.key}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                reportTypeFilter === tab.key
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              }`}
              onClick={() => setReportTypeFilter(tab.key)}
            >
              {tab.label}
              <span className={`px-2 py-1 rounded-full text-xs ${
                reportTypeFilter === tab.key 
                  ? "bg-white/20 text-white" 
                  : "bg-gray-200 text-gray-600"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Cell Filter Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Cell
          </label>
          <div className="relative w-64">
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

        {/* Results Summary */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredReports.length}</span> reports
            {reportTypeFilter !== "all" && (
              <span> from <span className="font-semibold text-blue-600">{reportTypeFilter}s</span></span>
            )}
            {selectedCell !== "all" && (
              <span> in <span className="font-semibold text-green-600">{selectedCell}</span> cell</span>
            )}
          </p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
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
                  {showActions && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Symptoms
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Pigs Affected
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sender Role
                  </th>
                  {showActions && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                  )}
                  {!showActions && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  )}
                  {showActions && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={showActions ? "9" : "7"} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-900 mb-1">No reports found</p>
                        <p className="text-sm text-gray-500">
                          No reports match your current filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report, index) => (
                    <tr
                      key={report._id || index}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.district}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.sector}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {report.cell}
                        </span>
                      </td>
                      {showActions && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {report.phoneNumber}
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {report.symptoms}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                        {report.numberOfPigsAffected}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.senderRole === "farmer" 
                            ? "bg-green-100 text-green-800"
                            : report.senderRole === "veterinarian"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {report.senderRole || "Unknown"}
                        </span>
                      </td>
                      {showActions && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.createdAt
                            ? new Date(report.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                      )}
                      {!showActions && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            report.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : report.status === "received"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {report.status || "Pending"}
                          </span>
                        </td>
                      )}
                      {showActions && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {showRepliesButton && report.replies && report.replies.length > 0 && (
                              <button
                                onClick={() => onToggleReplies && onToggleReplies(report._id)}
                                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                              >
                                {expandedReports.includes(report._id) ? "Hide" : "View"} Replies
                              </button>
                            )}
                            <button
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                              onClick={() => onEdit && onEdit(report)}
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                              onClick={() => onDelete && onDelete(report._id)}
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTable;