import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getReport, deleteReport } from "../api_service/report/report";
import { updateReport } from "/src/api_service/report/report.js";
import SendReportForm from "../authentication/components/SendReportForm";
import { getProfile } from "../api_service/auth/auth";
import { HiOutlineLogout, HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import {
  FiFileText,
  FiTrendingUp,
  FiUser,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiMessageSquare,
  FiEye,
  FiEyeOff,
  FiPlus
} from "react-icons/fi";
import TrendComponent from "../authentication/components/trendComponent";
import { Link, useNavigate } from "react-router-dom";
import { getUserId } from "../api_service/auth/auth";
import { BiHome } from "react-icons/bi";
import HomeTab from "./Rwamagana-components/HomeTab";
import GuidanceComponent from "./farmer-components/Guidance";

export default function FarmerDashboard() {
  const [previousReport, setPreviousReport] = useState([]);
  const [activeTab, setActiveTab] = useState("Home");
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [editReportData, setEditReportData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedReports, setExpandedReports] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Account removed successfully");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  useEffect(() => {
    if (activeTab === "previousReport") {
      getReport(setPreviousReport, setIsLoading);
    }
  }, [activeTab]);

  useEffect(() => {
    getProfile(setProfile, setIsLoading);
  }, []);

  const handleEdit = (report) => {
    setEditReportData(report);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editReportData) return;
    const success = await updateReport(
      editReportData._id,
      editReportData,
      setIsLoading
    );
    if (success) {
      setPreviousReport((prev) =>
        prev.map((r) => (r._id === editReportData._id ? editReportData : r))
      );
      setShowEditModal(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedReportId) return;
    const success = await deleteReport(selectedReportId, setIsLoading);
    if (success) {
      setPreviousReport((prev) =>
        prev.filter((report) => report._id !== selectedReportId)
      );
    }
    setShowConfirmModal(false);
  };

  const toggleExpand = (id) => {
    setExpandedReports((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const menuItems = [
   { id: "Home", label: "Home", icon: BiHome },
    { id: "sendReport", label: "Send Report", icon: FiPlus },
    { id: "previousReport", label: "Previous Reports", icon: FiFileText },
    { id: "Guidance", label: "Guidance", icon: FiTrendingUp },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Home":
   
  return <HomeTab />;
      case "sendReport":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Submit New Report
              </h2>
              <p className="text-gray-600 mt-1">
                Report pig health issues in your area
              </p>
            </div>
            <SendReportForm />
          </div>
        );
        
      case "previousReport":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    My Previous Reports
                  </h2>
                  <p className="text-gray-600 mt-1">
                    View and manage your submitted reports
                  </p>
                </div>
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
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : previousReport.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Symptoms
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Pigs Affected
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Replies
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previousReport.map((report, index) => (
                          <>
                            <tr
                              key={report._id}
                              className={`hover:bg-gray-50 transition-colors duration-150 ${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                              }`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {new Date(report.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div>
                                  <div className="font-medium">{report.district}</div>
                                  <div className="text-gray-500">{report.sector}, {report.cell}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                                <div className="truncate" title={report.symptoms}>
                                  {report.symptoms}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                {report.numberOfPigsAffected}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {report.phoneNumber}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  report.replies && report.replies.length > 0
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                  {report.replies ? report.replies.length : 0} replies
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => toggleExpand(report._id)}
                                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-1"
                                  >
                                    {expandedReports.includes(report._id) ? (
                                      <>
                                        <FiEyeOff className="w-3 h-3" />
                                        <span>Hide</span>
                                      </>
                                    ) : (
                                      <>
                                        <FiEye className="w-3 h-3" />
                                        <span>View</span>
                                      </>
                                    )}
                                  </button>
                                  <button
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-1"
                                    onClick={() => handleEdit(report)}
                                  >
                                    <FiEdit className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-1"
                                    onClick={() => {
                                      setSelectedReportId(report._id);
                                      setShowConfirmModal(true);
                                    }}
                                  >
                                    <FiTrash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {expandedReports.includes(report._id) && (
                              <tr>
                                <td colSpan="7" className="px-6 py-4 bg-blue-50">
                                  <div className="bg-white border border-blue-200 p-4 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-3">
                                      <FiMessageSquare className="w-4 h-4 text-blue-600" />
                                      <h4 className="font-semibold text-blue-700">Replies & Communications</h4>
                                    </div>
                                    {report.replies && report.replies.length > 0 ? (
                                      <div className="space-y-3">
                                        {report.replies.map((reply, idx) => (
                                          <div
                                            key={idx}
                                            className="bg-gray-50 border border-gray-200 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                          >
                                            <p className="text-sm text-gray-800 mb-2">
                                              {reply.message}
                                            </p>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                              <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                                From: {reply.senderRole}
                                              </span>
                                              <span className="bg-gray-100 px-2 py-1 rounded-full">
                                                {new Date(reply.sentAt).toLocaleString()}
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-center py-6">
                                        <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">No replies yet.</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          Your report is being reviewed by authorities.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports submitted yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start by submitting your first pig health report.
                  </p>
                  <button
                    onClick={() => setActiveTab("sendReport")}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Submit First Report</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case "Guidance":
      return <GuidanceComponent />
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
        className={`fixed left-0 top-0 h-full w-72 text-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
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
                    Farmer: {profile.lastName || 'User'}
                  </h3>
                  <p className="text-sm text-gray-500">Pig Health Reporter</p>
                </div>
              
              </div>
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <HiOutlineX className="w-6 h-6 text-gray-400" />
              </button>
              </Link>
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
        <header className="bg-white fixed top-0 z-50 shadow-sm border-b border-gray-200 p-4 w-full">
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
                  Farmer Dashboard
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Monitor and report pig health in your area
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
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Confirm Deletion
              </h2>
              <p className="text-gray-600">
                Are you sure you want to delete this report? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-center space-x-4 pt-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
              >
                Delete Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full mx-4 space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiEdit className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit Report
              </h2>
              <p className="text-gray-600 mt-1">Update your report information</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  value={editReportData?.district || ''}
                  onChange={(e) =>
                    setEditReportData({
                      ...editReportData,
                      district: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter district"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                <input
                  type="text"
                  value={editReportData?.sector || ''}
                  onChange={(e) =>
                    setEditReportData({
                      ...editReportData,
                      sector: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter sector"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cell</label>
                <input
                  type="text"
                  value={editReportData?.cell || ''}
                  onChange={(e) =>
                    setEditReportData({ ...editReportData, cell: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter cell"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                <textarea
                  value={editReportData?.symptoms || ''}
                  onChange={(e) =>
                    setEditReportData({
                      ...editReportData,
                      symptoms: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the symptoms"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Pigs Affected</label>
                <input
                  type="number"
                  value={editReportData?.numberOfPigsAffected || ''}
                  onChange={(e) =>
                    setEditReportData({
                      ...editReportData,
                      numberOfPigsAffected: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter number of pigs affected"
                />
              </div>
            </div>
            
            <div className="flex justify-center space-x-4 pt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Update Report
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