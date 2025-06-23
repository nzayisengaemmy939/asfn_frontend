import { BiChevronDown } from "react-icons/bi";
import EditReport from "../../authentication/components/EditReeport";
import DeleteReport from "../../authentication/components/DeleteReport";
import ReplyComponent from "../../authentication/components/ReplyComponent";

const ReportsTab = ({
  reportTab,
  setReportTab,
  reports,
  users,
  editMode,
  setEditMode,
  editingReportId,
  editForm,
  handleChange,
  handleSave,
  handleStatusChange,
  handleEditClick,
  assignVet,
  showConfirmModal2,
  setShowConfirmModal2,
  setSelectedReportId,
  handleDeleteConfirmed2,
  userToken,
}) => {
  const currentReports = reports.filter((r) => r.senderRole === reportTab);

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
                            onChange={(e) => assignVet(r._id, e.target.value)}
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
};

export default ReportsTab;