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
import { HiOutlineLogout, HiOutlineX } from "react-icons/hi";
import {
  FiUsers,
  FiFileText,
  FiTrendingUp,
  FiHelpCircle,
  FiUser,
  FiSearch,
} from "react-icons/fi";
import EditReport from "../authentication/components/EditReeport";
import TrendComponent from "../authentication/components/trendComponent";
import DeleteUser from "../authentication/components/DeleteUser";
import DeleteReport from "../authentication/components/DeleteReport";
import ReplyComponent from "../authentication/components/ReplyComponent";
import { BiChevronDown, BiHome } from "react-icons/bi";
import { Link } from "react-router-dom";
import HomeTab from "./vet-components/HomeTab";
import Sidebar from "./ntunga-components/Sidebar";
import TabContent from "./ntunga-components/TabContent";
import Header from "./ntunga-components/Header";

export default function AuthorityDashboard() {
  const [activeTab, setActiveTab] = useState("Home");
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

  useEffect(() => {
    getUsers(setUsers, setIsLoading);
    getReports(setReports, setIsLoading);
  }, [activeTab]);

  const handleStatusChange = async (reportId, newStatus) => {
    setReports((prev) =>
      prev.map((report) =>
        report._id === reportId ? { ...report, status: newStatus } : report
      )
    );

    const success = await updateReportStatus(reportId, newStatus, setIsLoading);

    if (!success) {
      setReports((prev) =>
        prev.map((report) =>
          report._id === reportId
            ? { ...report, status: report.status }
            : report
        )
      );
      getReports(setReports, setIsLoading);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user
      )
    );

    try {
      console.log(`Updating user ${userId} role to ${newRole}`);
      toast.success("User role updated successfully");
    } catch (error) {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, role: user.role }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar Component */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:ml-72 flex-1">
        <Header></Header>
        {/* Content */}
        <main className="p-6 mt-20 text-sm">
          <TabContent
            activeTab={activeTab}
            reportTab={reportTab}
            setReportTab={setReportTab}
            reports={reports}
            users={users}
            editMode={editMode}
            setEditMode={setEditMode}
            editingReportId={editingReportId}
            editForm={editForm}
            handleChange={handleChange}
            handleSave={handleSave}
            handleStatusChange={handleStatusChange}
            handleRoleChange={handleRoleChange}
            handleEditClick={handleEditClick}
            assignVet={assignVet}
            showConfirmModal={showConfirmModal}
            setShowConfirmModal={setShowConfirmModal}
            showConfirmModal2={showConfirmModal2}
            setShowConfirmModal2={setShowConfirmModal2}
            setSelectedReportId={setSelectedReportId}
            setUserId={setUserId}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            handleDeleteConfirmed={handleDeleteConfirmed}
            handleDeleteConfirmed2={handleDeleteConfirmed2}
            userToken={userToken}
          />
        </main>
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