import { useState, useEffect } from "react";

import { deleteUser, getUsers } from "../api_service/auth/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditUser from "../authentication/components/EditUser";
import {
  assignReportToVet,
  deleteReport,
  getReports,
  updateReport,
} from "../api_service/report/report";
import { HiOutlineLogout } from "react-icons/hi";
import EditReport from "../authentication/components/EditReeport";
import TrendComponent from "../authentication/components/trendComponent";
import DeleteUser from "../authentication/components/DeleteUser";
import DeleteReport from "../authentication/components/DeleteReport";
import ReplyComponent from "../authentication/components/ReplyComponent";
import { useNavigate } from "react-router-dom";

export default function AuthorityDashboard() {
  const [activeTab, setActiveTab] = useState("reports");
  const [reportTab, setReportTab] = useState("farmer");
  const [, setIsLoading] = useState(false);
  const [reports, setReports] = useState([]);

  const [users, setUsers] = useState([]);

  console.log(users, "all suers");

  useEffect(() => {
    getUsers(setUsers, setIsLoading);
  }, [activeTab]);

  useEffect(() => {
    getReports(setReports, setIsLoading);
  }, [activeTab]);

  const [editId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal2, setShowConfirmModal2] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingReportId, setEditingReportId] = useState(null);
  const [editForm, setEditForm] = useState({
    district: "",
    sector: "",
    cell: "",
    location: "",
    symptoms: "",
    pigsAffected: 0,
  });

  const [editingUser, setEditingUser] = useState(null);

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
      setReports((prev) =>
        prev.filter((report) => report._id !== selectedReportId)
      );
    }

    setShowConfirmModal2(false);
    setSelectedReportId(null);
  };

  const assignVet = async (id, vetEmail) => {
    const success = await assignReportToVet(id, vetEmail, setIsLoading);
    if (success) {
      getReports(); // re-fetch the updated reports list from backend
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!userId) return;
    await deleteUser(userId, setIsLoading);

    setShowConfirmModal2(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const success = await updateReport(editingReportId, editForm, setIsLoading);
    if (success) {
      setReports((prev) =>
        prev.map((report) =>
          report._id === editingReportId ? { ...report, ...editForm } : report
        )
      );
      setEditMode(false);
      setEditingReportId(null);
    }
  };
  const navigate=useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Account removed successfully");
    setTimeout(()=>{
navigate('/')
    },2000)
  };
  const userToken = localStorage.getItem("token");
  const renderTabContent = () => {
    switch (activeTab) {
      case "reports":
        const currentReports = reports.filter(
          (report) => report.senderRole === reportTab
        );

        return (
          <div className="space-y-4">
            <div className="flex space-x-4  pb-2">
              {["farmer", "veterinarian"].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setReportTab(sub)}
                  className={`px-3 py-1 font-medium capitalize ${
                    reportTab === sub
                      ? "text-blue-700 border-b-2 border-blue-700"
                      : "text-gray-500"
                  }`}
                >
                  {sub} Reports
                </button>
              ))}
            </div>
            {editMode && (
              <div>
                <EditReport
                  reportId={editingReportId}
                  editForm={editForm}
                  onChange={handleChange}
                  onSave={handleSave}
                  onCancel={() => setEditMode(false)}
                />
              </div>
            )}

            {currentReports.map((report) => (
              <div
                key={report._id}
                className="bg-gray-50  p-4 border-[1px] border-gray-100]"
              >
                <h3 className="text-lg font-semibold text-blue-700">
                  Report #{report._id}
                </h3>
                {editId === report.id && reportTab === "farmer" ? (
                  <div></div>
                ) : (
                  <div className="space-y-1">
                    <p>
                      <strong>Farmer:</strong> {report.senderRole}
                    </p>
                    <p>
                      <strong>district:</strong> {report.district}
                    </p>
                    <p>
                      <strong>sector:</strong> {report.sector}
                    </p>
                    <p>
                      <strong>cell:</strong> {report.cell}
                    </p>
                    <p className="text-justify block">
                      <strong>Symptoms:</strong> {report.symptoms}
                    </p>
                    <p>
                      <strong>Pigs Affected:</strong>{" "}
                      {report.numberOfPigsAffected}
                    </p>
                    <p>
                      <strong>Assigned Vet:</strong>{" "}
                      {report.assignedTo || "None"}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {report.resolved ? "Resolved" : "Pending"}
                    </p>

                    {reportTab === "farmer" && (
                      <div className="flex gap-2 mt-2">
                        <select
                          className="border px-2 py-1 rounded text-black"
                          value={report.assignedVet || ""}
                          onChange={(e) =>
                            assignVet(report._id, e.target.value)
                          }
                        >
                          <option value="">Assign Vet</option>
                          {users
                            .filter((u) => u.role === "veterinarian")
                            .map((vet) => (
                              <option key={vet.id} value={vet.email}>
                                {vet.email}
                              </option>
                            ))}
                        </select>
                        <ReplyComponent
                          reportId={report._id}
                          senderRole="authority"
                          token={userToken}
                        />

                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                          onClick={() => handleEditClick(report)}
                        >
                          Edit
                        </button>

                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded"
                          onClick={() => {
                            setSelectedReportId(report._id);
                            setShowConfirmModal2(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {/* Delete Modal */}
                {showConfirmModal2 && (
                  <div>
                    <DeleteReport
                      setShowConfirmModal2={setShowConfirmModal2}
                      handleDeleteConfirmed2={handleDeleteConfirmed2}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "help":
        return (
          <div className="bg-white p-4 rounded-xl">
            <h2 className="text-xl font-semibold text-blue-700">
              Provide Help
            </h2>
            <p className="text-gray-600 mt-2">
              You can initiate interventions from this section. (Feature
              placeholder)
            </p>
          </div>
        );

      case "trends":
        return (
          <div>
            <TrendComponent />
          </div>
        );

      case "users":
        return (
          <div className="bg-white p-4 rounded-xl">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              All Users
            </h2>
            <ul className="space-y-2">
              {showConfirmModal && (
                <DeleteUser
                  setShowConfirmModal={setShowConfirmModal}
                  handleDeleteConfirmed={handleDeleteConfirmed}
                />
              )}

              {editingUser && (
                <EditUser
                  user={editingUser}
                  setShowEditModal={() => setEditingUser(null)}
                />
              )}

              {users.map((user) => (
                <div className="flex justify-between border p-3 rounded shadow-sm bg-gray-50">
                  <div>
                    <li key={user.id} className="">
                      <p>
                        <strong>firstName:</strong> {user.firstName}
                      </p>
                      <p>
                        <strong>lastName:</strong> {user.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>Role:</strong> {user.role}
                      </p>
                    </li>
                  </div>
                  <div>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => setEditingUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded ml-2"
                      onClick={() => {
                        setUserId(user._id);
                        setShowConfirmModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">
          Authority Dashboard
        </h1>
        <div className="flex gap-1 items-center">
          <HiOutlineLogout color="blue" onClick={handleLogout} />
          <button
            className="text-blue-600 hover:text-blue-700 font-semibold"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto mt-8 px-4 border-[1px] border-gray-100 rounded-md bg-white py-4">
        <div className="flex space-x-4  mb-6 border-[1px] border-gray-100 bg-gray-50 ">
          {["reports", "help", "trends", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold capitalize ${
                activeTab === tab
                  ? "text-blue-700 border-b-2 border-blue-700"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} />

        {renderTabContent()}
      </div>
    </div>
  );
}
