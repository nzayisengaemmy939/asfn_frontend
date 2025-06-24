import React, { useState, useEffect } from "react";
import { BiChevronDown } from "react-icons/bi";
import { getReports } from "../../api_service/report/report";

// Delete Report API function
const deleteReport = async (reportId) => {
    const frontend = import.meta.env.VITE_BACKEND_URL;
  try {
    const response = await fetch(`${frontend}/report/delete/${reportId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete report');
    }
    return true;
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
};

// Update Report API function
const updateReport = async (reportId, updatedData) => {
    const frontend = import.meta.env.VITE_BACKEND_URL;
  try {
    const response = await fetch(`${frontend}/report/edit/${reportId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    alert("report updated successfully")
    if (!response.ok) {
      throw new Error('Failed to update report');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
};

// Update Report Status API function
const updateReportStatus = async (reportId, status) => {
  try {
    const response = await fetch(`/api/reports/${reportId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update status');
    }
    return true;
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};

// Delete Report Modal Component
const DeleteReport = ({ reportId, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Confirm Delete
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this report? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reportId)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Report Modal Component
const EditReport = ({ report, onSave, onCancel }) => {
  const [editForm, setEditForm] = useState({
    district: report.district,
    sector: report.sector,
    cell: report.cell,
    symptoms: report.symptoms,
    numberOfPigsAffected: report.numberOfPigsAffected,
    status: report.status
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave(report._id, editForm);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Edit Report
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District
            </label>
            <input
              type="text"
              name="district"
              value={editForm.district}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sector
            </label>
            <input
              type="text"
              name="sector"
              value={editForm.sector}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cell
            </label>
            <input
              type="text"
              name="cell"
              value={editForm.cell}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Pigs Affected
            </label>
            <input
              type="number"
              name="numberOfPigsAffected"
              value={editForm.numberOfPigsAffected}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Symptoms
            </label>
            <textarea
              name="symptoms"
              value={editForm.symptoms}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={editForm.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="received">Received</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const ReportTab = () => {
  // State management
  const [reportTab, setReportTab] = useState("farmer");
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [editingReport, setEditingReport] = useState(null);

  // Fetch reports on component mount and when tab changes
  useEffect(() => {
    getReports(setReports, setIsLoading);
  }, [reportTab]);

  // Filter current reports based on selected tab
  const currentReports = reports.filter((r) => r.senderRole === reportTab);

  // Handle status change
  const handleStatusChange = async (reportId, newStatus) => {
    try {
      // Update local state immediately for better UX
      setReports(prev => 
        prev.map(report => 
          report._id === reportId 
            ? { ...report, status: newStatus }
            : report
        )
      );

      // Make API call to update status
      await updateReportStatus(reportId, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert the change if API call fails
      getReports(setReports, setIsLoading);
    }
  };

  // Handle edit click
  const handleEditClick = (report) => {
    setEditingReport(report);
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async (reportId, updatedData) => {
    try {
      await updateReport(reportId, updatedData);
      
      // Update local state
      setReports(prev => 
        prev.map(report => 
          report._id === reportId 
            ? { ...report, ...updatedData }
            : report
        )
      );

      setShowEditModal(false);
      setEditingReport(null);
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Failed to update report. Please try again.');
    }
  };

  // Handle delete click
  const handleDeleteClick = (reportId) => {
    setSelectedReportId(reportId);
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirmed = async (reportId) => {
    try {
      await deleteReport(reportId);

      // Remove from local state
      setReports(prev => prev.filter(report => report._id !== reportId));
      setShowDeleteModal(false);
      setSelectedReportId(null);
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                      <div className="flex items-center space-x-2">
                        <button
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                          onClick={() => handleEditClick(r)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                          onClick={() => handleDeleteClick(r._id)}
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

        {currentReports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No {reportTab} reports found.
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteReport
          reportId={selectedReportId}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedReportId(null);
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingReport && (
        <EditReport
          report={editingReport}
          onSave={handleSaveEdit}
          onCancel={() => {
            setShowEditModal(false);
            setEditingReport(null);
          }}
        />
      )}
    </div>
  );
};

export default ReportTab;