import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getReport, deleteReport } from "../api_service/report/report";
import { updateReport } from "/src/api_service/report/report.js";
import SendReportForm from "../authentication/components/SendReportForm";
import { getProfile } from "../api_service/auth/auth";
import { HiOutlineLogout } from "react-icons/hi";
import TrendComponent from "../authentication/components/trendComponent";
import { useNavigate } from "react-router-dom";

export default function FarmerDashboard() {
  const [previousReport, setPreviousReport] = useState([]);
  const [activeTab, setActiveTab] = useState("sendReport");
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [editReportData, setEditReportData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedReports, setExpandedReports] = useState([]);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "sendReport":
        return <SendReportForm />;
      case "previousReport":
        return (
          <div>
            {isLoading ? (
              <p>Loading...</p>
            ) : previousReport.length > 0 ? (
              <div className="space-y-4 mt-4">
                {previousReport.map((report, index) => (
                  <div
                    key={index}
                    className="border-[1px] border-gray-100 rounded-md space-y-4"
                  >
                    <div className="bg-gray-50 p-4">
                      <p>
                        <span className="font-semibold">District:</span>{" "}
                        {report.district}
                      </p>
                      <p>
                        <span className="font-semibold">Sector:</span>{" "}
                        {report.sector}
                      </p>
                      <p>
                        <span className="font-semibold">Cell:</span>{" "}
                        {report.cell}
                      </p>
                      <p>
                        <span className="font-semibold">Phone Number:</span>{" "}
                        {report.phoneNumber}
                      </p>
                      <p className="text-gray-500">
                        <span className="font-semibold">Symptoms:</span>{" "}
                        {report.symptoms}
                      </p>
                      <p className="text-gray-500">
                        <span className="font-semibold">Pigs Affected:</span>{" "}
                        {report.numberOfPigsAffected}
                      </p>
                      <span className="align-baseline text-gray-500">{new Date(report.createdAt).toLocaleString()}</span>

                      <div className="mt-2">
                        <button
                          onClick={() => toggleExpand(report._id)}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          {expandedReports.includes(report._id)
                            ? "Hide Reply"
                            : "Replied"}
                        </button>
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded ml-3"
                          onClick={() => handleEdit(report)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded ml-3"
                          onClick={() => {
                            setSelectedReportId(report._id);
                            setShowConfirmModal(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      {expandedReports.includes(report._id) && (
                        <div className="mt-4 bg-white border p-3 rounded">
                          {report.replies && report.replies.length > 0 ? (
                            <div>
                              <p className="text-sm font-semibold text-blue-700 mb-2">
                                all Replies:
                              </p>
                              <ul className="space-y-2">
                                {report.replies.map((reply, idx) => (
                                  <li
                                    key={idx}
                                    className="bg-gray-50 p-2 rounded shadow-sm"
                                  >
                                    <p className="text-sm text-gray-800">
                                      {reply.message}
                                    </p>
                                    <div className="text-xs text-gray-500 flex justify-between mt-1">
                                      <span className="capitalize">
                                        From: {reply.senderRole}
                                      </span>
                                      <span>
                                        {new Date(
                                          reply.sentAt
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">
                              No replies yet.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No report submitted yet.</p>
            )}
          </div>
        );
      case "trends":
        return (
          <div>
            <TrendComponent />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-semibold text-blue-700">
          Farmer: {profile.lastName}
        </div>
        <div className="flex gap-1 items-center">
          <HiOutlineLogout color="blue" onClick={handleLogout} />
          <button
            onClick={handleLogout}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto border-[1px] bg-white border-gray-100 rounded-xl p-8 space-y-3 mt-3">
        <h1 className="text-3xl font-bold text-blue-700 text-center">
          Farmer Dashboard
        </h1>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("sendReport")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "sendReport"
                ? "text-blue-700 border-b-2 border-blue-700"
                : "text-gray-500"
            }`}
          >
            Send Report
          </button>
          <button
            onClick={() => setActiveTab("previousReport")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "previousReport"
                ? "text-blue-700 border-b-2 border-blue-700"
                : "text-gray-500"
            }`}
          >
            Previous Report
          </button>
          <button
            onClick={() => setActiveTab("trends")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "trends"
                ? "text-blue-700 border-b-2 border-blue-700"
                : "text-gray-500"
            }`}
          >
            Trends
          </button>
        </div>

        {renderTabContent()}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-gray-600">
              Are you sure you want to delete this report?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full space-y-4">
            <h2 className="text-lg font-semibold text-blue-700">Edit Report</h2>
            <div className="space-y-2">
              <input
                type="text"
                value={editReportData.district}
                onChange={(e) =>
                  setEditReportData({
                    ...editReportData,
                    district: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="District"
              />
              <input
                type="text"
                value={editReportData.sector}
                onChange={(e) =>
                  setEditReportData({
                    ...editReportData,
                    sector: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Sector"
              />
              <input
                type="text"
                value={editReportData.cell}
                onChange={(e) =>
                  setEditReportData({ ...editReportData, cell: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Cell"
              />
              <input
                type="text"
                value={editReportData.symptoms}
                onChange={(e) =>
                  setEditReportData({
                    ...editReportData,
                    symptoms: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Symptoms"
              />
              <input
                type="number"
                value={editReportData.numberOfPigsAffected}
                onChange={(e) =>
                  setEditReportData({
                    ...editReportData,
                    numberOfPigsAffected: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Pigs Affected"
              />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
              <ToastContainer position="bottom-right" autoClose={3000} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
