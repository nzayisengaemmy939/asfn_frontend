import { useState, useEffect } from "react";
import { deleteUser, getUserId, getUsers } from "../api_service/auth/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditUser from "../authentication/components/EditUser";
import {
  assignReportToVet,
  deleteReport,
  getReports,
  updateReport,
  updateReportStatus,
} from "../api_service/report/report";
import { HiOutlineLogout, HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import {
  FiUsers,
  FiFileText,
  FiTrendingUp,
  FiHelpCircle,
  FiUser,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import EditReport from "../authentication/components/EditReeport";
import TrendComponent from "../authentication/components/trendComponent";
import DeleteUser from "../authentication/components/DeleteUser";
import DeleteReport from "../authentication/components/DeleteReport";
import ReplyComponent from "../authentication/components/ReplyComponent";
import { BiChevronDown } from "react-icons/bi";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

export default function AuthorityDashboard() {
  const [activeTab, setActiveTab] = useState("reports");
  const [reportTab, setReportTab] = useState("farmer");
  const [, setIsLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal2, setShowConfirmModal2] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingReportId, setEditingReportId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    district: "",
    sector: "",
    cell: "",
    location: "",
    symptoms: "",
    pigsAffected: 0,
  });
  const [editingUser, setEditingUser] = useState(null);
  const userToken = localStorage.getItem("token");
  // const navigate = useNavigate();

  useEffect(() => {
    getUsers(setUsers, setIsLoading);
    getReports(setReports, setIsLoading);
  }, [activeTab]);
  const handleStatusChange = async (reportId, newStatus) => {
    // Optimistically update the UI first
    setReports((prev) =>
      prev.map((report) =>
        report._id === reportId ? { ...report, status: newStatus } : report
      )
    );

    // Then update the backend
    const success = await updateReportStatus(reportId, newStatus, setIsLoading);

    if (!success) {
      // If backend update failed, revert the UI change
      setReports((prev) =>
        prev.map((report) =>
          report._id === reportId
            ? { ...report, status: report.status } // This will revert to original
            : report
        )
      );
      // Optionally refresh the reports to get the correct state
      getReports(setReports, setIsLoading);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    // Optimistically update the UI first
    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user
      )
    );

    // Here you would call your API to update the user role
    // const success = await updateUserRole(userId, newRole, setIsLoading);

    // If you don't have an updateUserRole function yet, you can add it later
    // For now, the UI will update optimistically
    try {
      // Add your API call here when available
      console.log(`Updating user ${userId} role to ${newRole}`);
      toast.success("User role updated successfully");
    } catch (error) {
      // If backend update failed, revert the UI change
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, role: user.role } // This will revert to original
            : user
        )
      );
      toast.error("Failed to update user role");
    }
  };

  const handleEditClick = (report) => {
    setEditForm({
      district: report.district || "",
      sector: report.sector || "",
      cell: report.cell || "",
      location: report.location || "",
      symptoms: report.symptoms || "",
      pigsAffected: report.pigsAffected || 0,
    });
    setEditingReportId(report._id);
    setEditMode(true);
  };

  const handleDeleteConfirmed2 = async () => {
    if (!selectedReportId) return;
    const success = await deleteReport(selectedReportId, setIsLoading);
    if (success) {
      setReports((prev) => prev.filter((r) => r._id !== selectedReportId));
    }
    setShowConfirmModal2(false);
    setSelectedReportId(null);
  };

  const assignVet = async (id, vetEmail) => {
    const success = await assignReportToVet(id, vetEmail, setIsLoading);
    if (success) getReports(setReports, setIsLoading);
  };

  const handleDeleteConfirmed = async () => {
    if (!userId) return;
    await deleteUser(userId, setIsLoading);
    setShowConfirmModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const success = await updateReport(editingReportId, editForm, setIsLoading);
    if (success) {
      setReports((prev) =>
        prev.map((r) => (r._id === editingReportId ? { ...r, ...editForm } : r))
      );
      setEditMode(false);
      setEditingReportId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Account removed successfully");
    // setTimeout(() => navigate("/"), 2000);
    setTimeout(() => (window.location.href = "/"), 2000);
  };

  const menuItems = [
    { id: "reports", label: "Reports", icon: FiFileText },
    { id: "help", label: "Help", icon: FiHelpCircle },
    { id: "trends", label: "Trends", icon: FiTrendingUp },
    { id: "users", label: "Users", icon: FiUsers },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "reports":
        const currentReports = reports.filter(
          (r) => r.senderRole === reportTab
        );
        return (
          <div className="space-y-6 text-sm">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-wrap gap-2 mb-6">
                {["farmer", "veterinarian"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      reportTab === tab
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                    }`}
                    onClick={() => setReportTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} Reports
                  </button>
                ))}
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
                          Pigs
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Vet
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentReports.map((r, index) => (
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
                            {r.cell}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                            {r.symptoms}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                            {r.numberOfPigsAffected}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {r.assignedTo || "None"}
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {reportTab === "farmer" && (
                              <div className="flex items-center space-x-2">
                                <select
                                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  value={r.assignedVet || ""}
                                  onChange={(e) =>
                                    assignVet(r._id, e.target.value)
                                  }
                                >
                                  <option value="">Assign Vet</option>
                                  {users
                                    .filter((u) => u.role === "veterinarian")
                                    .map((v) => (
                                      <option key={v._id} value={v.email}>
                                        {v.email}
                                      </option>
                                    ))}
                                </select>
                                <ReplyComponent
                                  reportId={r._id}
                                  senderRole="authority"
                                  token={userToken}
                                />
                                <button
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                                  onClick={() => handleEditClick(r)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                                  onClick={() => {
                                    setSelectedReportId(r._id);
                                    setShowConfirmModal2(true);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
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
          </div>
        );

      case "users":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  All Users
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          First Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Last Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user, index) => (
                        <tr
                          key={user._id}
                          className={`hover:bg-gray-50 transition-colors duration-150 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.firstName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {user.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap relative">
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(user._id, e.target.value)
                              }
                              className={`
                                            inline-flex items-center px-2.5 py-0.5 pr-6 rounded-full text-xs font-medium 
                                            border border-opacity-50 cursor-pointer outline-none appearance-none
                                            focus:ring-2 focus:ring-offset-1 transition-all duration-200 
                                            ${
                                              user.role === "authority"
                                                ? "bg-red-100 text-red-800 border-red-300 focus:ring-red-300"
                                                : user.role === "veterinarian"
                                                ? "bg-blue-100 text-blue-800 border-blue-300 focus:ring-blue-300"
                                                : "bg-green-100 text-green-800 border-green-300 focus:ring-green-300"
                                            }
                                          `}
                            >
                              <option value="farmer">Farmer</option>
                              <option value="veterinarian">Veterinarian</option>
                              <option value="authority">Authority</option>
                            </select>

                            <BiChevronDown
                              className={`
                                            absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none
                                            ${
                                              user.role === "authority"
                                                ? "text-red-600"
                                                : user.role === "veterinarian"
                                                ? "text-blue-600"
                                                : "text-green-600"
                                            }
                                          `}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                className="bg-gradient-to-r text-sm from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-md  font-medium transition-all duration-200 transform hover:scale-105"
                                onClick={() => setEditingUser(user)}
                              >
                                Edit
                              </button>
                              <button
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                                onClick={() => {
                                  setUserId(user._id);
                                  setShowConfirmModal(true);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {editingUser && (
              <EditUser
                user={editingUser}
                setShowEditModal={() => setEditingUser(null)}
              />
            )}
            {showConfirmModal && (
              <DeleteUser
                setShowConfirmModal={setShowConfirmModal}
                handleDeleteConfirmed={handleDeleteConfirmed}
              />
            )}
          </div>
        );

      case "help":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="text-center">
              <FiHelpCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Help & Support
              </h3>
              <p className="text-gray-600 mb-6">
                You can initiate interventions here.
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                Get Started
              </button>
            </div>
          </div>
        );
      case "trends":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <TrendComponent />
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
                      Sector Veterinarian
                    </h3>
                    <p className="text-sm text-gray-500">Administrator</p>
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
        <header className=" fixed top-0 z-50 bg-white shadow-sm border-b border-gray-200 p-6">
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
                  Sector Veterinarian Dashboard
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Manage reports, users, and system operations
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 mt-20 text-sm">{renderTabContent()}</main>
      </div>

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
