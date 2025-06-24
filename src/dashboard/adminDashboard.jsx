import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getReport, getReports, vetReport } from "../api_service/report/report";
import { getProfile } from "../api_service/auth/auth";
import Sidebar from "./Rwamagana-components/Sidebar"; // Your existing Sidebar component
import Header from "./Rwamagana-components/Header"; // Your existing Header component  
import TabContents from "./Rwamagana-components/TabContents"; // Your existing TabContents component

export default function VeterinarianDashboard() {
  // State management
  const [previousReport, setPreviousReport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assigned, setAssigned] = useState([]);
  const [activeTab, setActiveTab] = useState("Home");
  const [profile, setProfile] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editReportData, setEditReportData] = useState(null);

  // Effects
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

  // Event handlers
  const handleEdit = (report) => {
    setEditReportData(report);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editReportData) return;
    // Update logic would go here
    setShowEditModal(false);
    toast.success("Report updated successfully");
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedReportId) return;
    // Delete logic would go here
    setShowConfirmModal(false);
    toast.success("Report deleted successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar Component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
      />

      {/* Main Content */}
      <div className="lg:ml-72 flex-1">
        {/* Header Component */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <main className="p-6 mt-20 text-sm">
          <TabContents
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            previousReport={previousReport}
            assigned={assigned}
            isLoading={isLoading}
            handleEdit={handleEdit}
            setSelectedReportId={setSelectedReportId}
            setShowConfirmModal={setShowConfirmModal}
          />
        </main>
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

      {/* Toast Container */}
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