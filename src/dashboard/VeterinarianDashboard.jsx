import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getReport, getReports, vetReport } from "../api_service/report/report";
import TrendComponent from "../authentication/components/trendComponent";
import VetReportForm from "../authentication/components/vetReportForm"; // Import the VetReportForm component
import { getProfile, getUserId } from "../api_service/auth/auth";
import { HiOutlineLogout, HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import {
  FiFileText,
  FiTrendingUp,
  FiUser,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { BiHome } from "react-icons/bi";

export default function VeterinarianDashboard() {
  const [previousReport, setPreviousReport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assigned, setAssigned] = useState([]);
  const [activeTab, setActiveTab] = useState("myReports"); // Changed default to myReports
  const [profile, setProfile] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editReportData, setEditReportData] = useState(null);
  const [expandedReports, setExpandedReports] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getProfile(setProfile, setIsLoading);
  }, []);

  useEffect(() => {
    if (activeTab === "myReports") {
      getReport(setPreviousReport, setIsLoading);
    }
  }, [activeTab]);

  useEffect(() => {
    vetReport(setAssigned, setIsLoading);
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Account removed successfully");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleEdit = (report) => {
    setEditReportData(report);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editReportData) return;
    // Update logic would go here
    setShowEditModal(false);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedReportId) return;
    // Delete logic would go here
    setShowConfirmModal(false);
  };

  const toggleExpand = (id) => {
    setExpandedReports((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // Updated menu items with new structure
  const menuItems = [
    { id: "Home", label: "Home", icon: BiHome },
    { id: "sendReport", label: "Send Report", icon: FiPlus },
    { id: "myReports", label: "My Reports", icon: FiFileText },
    { id: "trends", label: "Trends", icon: FiTrendingUp },
    { id: "authorityReport", label: "Assigned Reports", icon: FiFileText },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "sendReport":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Submit New Report
                </h2>
              </div>
              <VetReportForm />
            </div>
          </div>
        );

      case "myReports":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  My Reports
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search reports..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading reports...</p>
                </div>
              ) : previousReport.length > 0 ? (
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
                            Phone
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Symptoms
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Pigs Affected
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previousReport.map((report, index) => (
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
                              {report.cell}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {report.phoneNumber}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                              {report.symptoms}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                              {report.numberOfPigsAffected}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {report.createdAt
                                ? new Date(
                                    report.createdAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                {report.replies &&
                                  report.replies.length > 0 && (
                                    <button
                                      onClick={() => toggleExpand(report._id)}
                                      className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                                    >
                                      {expandedReports.includes(report._id)
                                        ? "Hide"
                                        : "View"}{" "}
                                      Replies
                                    </button>
                                  )}
                                <button
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                                  onClick={() => handleEdit(report)}
                                >
                                  <FiEdit className="w-4 h-4" />
                                </button>
                                <button
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                                  onClick={() => {
                                    setSelectedReportId(report._id);
                                    setShowConfirmModal(true);
                                  }}
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // Updated empty state with call-to-action
                <div className="text-center py-12">
                  <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">
                    No reports submitted yet.
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    Get started by submitting your first veterinary report.
                  </p>
                  <button
                    onClick={() => setActiveTab("sendReport")}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <FiPlus className="w-5 h-5 mr-2" />
                    Submit New Report
                  </button>
                </div>
              )}

              {/* Expanded replies section */}
              {expandedReports.length > 0 && (
                <div className="mt-6 space-y-4">
                  {previousReport
                    .filter((report) => expandedReports.includes(report._id))
                    .map((report) => (
                      <div
                        key={report._id}
                        className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                      >
                        <h4 className="font-semibold text-blue-700 mb-3">
                          Replies for Report from {report.district}
                        </h4>
                        {report.replies && report.replies.length > 0 ? (
                          <div className="space-y-2">
                            {report.replies.map((reply, idx) => (
                              <div
                                key={idx}
                                className="bg-white p-3 rounded-md shadow-sm"
                              >
                                <p className="text-sm text-gray-800">
                                  {reply.message}
                                </p>
                                <div className="text-xs text-gray-500 flex justify-between mt-2">
                                  <span className="capitalize">
                                    From: {reply.senderRole}
                                  </span>
                                  <span>
                                    {new Date(reply.sentAt).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">
                            No replies yet.
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        );

      case "trends":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <TrendComponent />
          </div>
        );

      case "authorityReport":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Assigned Reports from Authority
                </h2>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 mt-4">
                    Loading assigned reports...
                  </p>
                </div>
              ) : assigned.length > 0 ? (
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
                            Pigs Affected
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {assigned.map((report, index) => (
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
                              {report.cell}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                              {report.symptoms}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                              {report.numberOfPigsAffected}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {report.status || "Pending"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    No reports assigned yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full text-sm w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Link to={`/profile/${getUserId()}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Dr. {profile.lastName || "Veterinarian"}
                    </h3>
                    <p className="text-sm text-gray-500">Veterinarian</p>
                  </div>
                </div>
              </Link>
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <HiOutlineX className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Logout Section */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-sm"
            >
              <HiOutlineLogout className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72 flex-1">
        {/* Header */}
        <header className="fixed top-0 z-50 bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <HiOutlineMenu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  District Veterinarian Dashboard
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Manage your reports and assigned cases
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 mt-20 text-sm">{renderTabContent()}</main>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this report? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Report Modal */}
      {showEditModal && editReportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Edit Report
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={editReportData.district || ""}
                onChange={(e) =>
                  setEditReportData({
                    ...editReportData,
                    district: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="District"
              />
              <input
                type="text"
                value={editReportData.sector || ""}
                onChange={(e) =>
                  setEditReportData({
                    ...editReportData,
                    sector: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Sector"
              />
              <input
                type="text"
                value={editReportData.cell || ""}
                onChange={(e) =>
                  setEditReportData({ ...editReportData, cell: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Cell"
              />
              <textarea
                value={editReportData.symptoms || ""}
                onChange={(e) =>
                  setEditReportData({
                    ...editReportData,
                    symptoms: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Symptoms"
                rows="3"
              />
              <input
                type="number"
                value={editReportData.numberOfPigsAffected || ""}
                onChange={(e) =>
                  setEditReportData({
                    ...editReportData,
                    numberOfPigsAffected: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Pigs Affected"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-50"
      />
    </div>
  );
}