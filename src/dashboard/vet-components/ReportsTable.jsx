import { FiEdit, FiTrash2 } from "react-icons/fi";

const ReportsTable = ({ 
  reports, 
  showActions = true, 
  onEdit, 
  onDelete, 
  onToggleReplies,
  expandedReports = [],
  showRepliesButton = true 
}) => {
  return (
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
              {showActions && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Symptoms
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Pigs Affected
              </th>
              {showActions && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
              )}
              {!showActions && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              )}
              {showActions && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report, index) => (
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
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {report.phoneNumber}
                  </td>
                )}
                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                  {report.symptoms}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                  {report.numberOfPigsAffected}
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                )}
                {!showActions && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {report.status || "Pending"}
                    </span>
                  </td>
                )}
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {showRepliesButton && report.replies && report.replies.length > 0 && (
                        <button
                          onClick={() => onToggleReplies && onToggleReplies(report._id)}
                          className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                        >
                          {expandedReports.includes(report._id) ? "Hide" : "View"} Replies
                        </button>
                      )}
                      <button
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                        onClick={() => onEdit && onEdit(report)}
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                        onClick={() => onDelete && onDelete(report._id)}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;