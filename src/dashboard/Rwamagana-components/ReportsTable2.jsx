import React, { useState } from "react";
import { BiChevronDown, BiDotsVerticalRounded } from "react-icons/bi";
import { ToastContainer,toast } from "react-toastify";

const ReportsTable = ({
  currentReports,
  setCurrentReports, // Add this prop to update the reports state
  loading,
  userNames,
  openDropdown,
  setOpenDropdown,
}) => {
  const [editingReport, setEditingReport] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  const toggleDropdown = (reportId) => {
    setOpenDropdown(openDropdown === reportId ? null : reportId);
  };

  // Handle status change
  const handleStatusChange = async (reportId, newStatus) => {
    try {
      // Update the report status in the local state immediately
      // setCurrentReports(prevReports =>
      //   prevReports.map(report =>
      //     report._id === reportId ? { ...report, status: newStatus } : report
      //   )
      // );

      // 🔥 PUT YOUR STATUS UPDATE API CALL HERE 🔥
      // const response = await fetch(`/api/reports/${reportId}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      // if (!response.ok) throw new Error('Failed to update status');
      
      console.log(`Status updated for report ${reportId} to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert the change if the API call fails
      // setCurrentReports(prevReports =>
      //   prevReports.map(report =>
      //     report._id === reportId ? { ...report, status: report.status } : report
      //   )
      // );
    }
  };

  // Handle edit report
  const handleEditClick = (report) => {
    setEditingReport(report._id);
    setEditFormData({
      district: report.district,
      sector: report.sector,
      cell: report.cell,
      symptoms: report.symptoms,
      status: report.status,
      senderRole: report.senderRole,
    });
    setOpenDropdown(null);
  };

  const handleUpdateReport = async () => {
    try {
      // 🔥 PUT YOUR UPDATE REPORT API CALL HERE 🔥
      const response = await fetch(`${frontend}/report/edit/${editingReport}}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      if (!response.ok) throw new Error('Failed to update report');

      // Update the report in the local state after successful API call
      // setCurrentReports(prevReports =>
      //   prevReports.map(report =>
      //     report._id === editingReport ? { ...report, ...editFormData } : report
      //   )
      // );
toast.success("Report updated successfully")
      console.log(`Report ${editingReport} updated successfully`);
      setEditingReport(null);
      setEditFormData({});
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Error updating report:', error)
      // Keep the edit form open on error so user can try again
    }
  };

  const cancelEdit = () => {
    setEditingReport(null);
    setEditFormData({});
  };

  // Handle delete report
  const handleDeleteClick = (reportId) => {
    setReportToDelete(reportId);
    setShowDeleteModal(true);
    setOpenDropdown(null);
  };

  const confirmDelete = async () => {
    try {
        const frontend = import.meta.env.VITE_BACKEND_URL;
  
      const response = await fetch( `${frontend}/report/delete/${reportToDelete}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete report');

    
      // setCurrentReports(prevReports =>
      //   prevReports.filter(report => report._id !== reportToDelete)
      // );
     toast.success("report deleted successfully");
      console.log(`Report ${reportToDelete} deleted successfully`);
      setShowDeleteModal(false);
      setReportToDelete(null);
    } catch (error) {
      console.error('Error deleting report:', error);
      setShowDeleteModal(false);
      setReportToDelete(null);
      // You could show an error toast/notification here
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setReportToDelete(null);
  };

  const handleActionClick = (action, report) => {
    setOpenDropdown(null);

    switch (action) {
      case "edit":
        handleEditClick(report);
        break;
      case "delete":
        handleDeleteClick(report._id);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <ToastContainer></ToastContainer>
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
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sender Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Reported By
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        Loading reports...
                      </p>
                      <p className="text-sm text-gray-500">
                        Please wait while we fetch the data
                      </p>
                    </div>
                  </td>
                </tr>
              ) : currentReports.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 mb-4 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        No reports found
                      </p>
                      <p className="text-sm text-gray-500">
                        No reports match your current filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentReports.map((r, index) => (
                  <tr
                    key={r._id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {editingReport === r._id ? (
                        <input
                          type="text"
                          value={editFormData.district}
                          onChange={(e) => setEditFormData({...editFormData, district: e.target.value})}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        r.district
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {editingReport === r._id ? (
                        <input
                          type="text"
                          value={editFormData.sector}
                          onChange={(e) => setEditFormData({...editFormData, sector: e.target.value})}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        r.sector
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {editingReport === r._id ? (
                        <input
                          type="text"
                          value={editFormData.cell}
                          onChange={(e) => setEditFormData({...editFormData, cell: e.target.value})}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {r.cell}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                      {editingReport === r._id ? (
                        <textarea
                          value={editFormData.symptoms}
                          onChange={(e) => setEditFormData({...editFormData, symptoms: e.target.value})}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows="2"
                        />
                      ) : (
                        <div className="group relative">
                          <span className="block truncate">
                            {r.symptoms && r.symptoms.length > 100 
                              ? `${r.symptoms.substring(0, 100)}...`
                              : r.symptoms
                            }
                          </span>
                          {r.symptoms && r.symptoms.length > 100 && (
                            <div className="absolute left-0 top-full mt-1 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                              <div className="max-h-32 overflow-y-auto">
                                {r.symptoms}
                              </div>
                              <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap relative">
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r._id, e.target.value)}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {editingReport === r._id ? (
                        <select
                          value={editFormData.senderRole}
                          onChange={(e) => setEditFormData({...editFormData, senderRole: e.target.value})}
                          className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="farmer">Farmer</option>
                          <option value="veterinarian">Veterinarian</option>
                          <option value="official">Official</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            r.senderRole === "farmer"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {r.senderRole}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {userNames[r.reportedBy] || "Loading..."}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingReport === r._id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleUpdateReport}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => toggleDropdown(r._id)}
                          >
                            <BiDotsVerticalRounded className="w-5 h-5 text-gray-600" />
                          </button>

                          {openDropdown === r._id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                              <div className="py-1">
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                                  onClick={() => handleActionClick("edit", r)}
                                >
                                  <svg
                                    className="w-4 h-4 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  Edit
                                </button>

                                <div className="border-t border-gray-100"></div>

                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                  onClick={() => handleActionClick("delete", r)}
                                >
                                  <svg
                                    className="w-4 h-4 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this report? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenDropdown(null)}
        ></div>
      )}
    </>
  );
};

export default ReportsTable;