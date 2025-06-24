import { FiSearch } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";
import EditUser from "../../authentication/components/EditUser";
import DeleteUser from "../../authentication/components/DeleteUser";

const UsersTab = ({
  users,
  handleRoleChange,
  editingUser,
  setEditingUser,
  showConfirmModal,
  setShowConfirmModal,
  setUserId,
  handleDeleteConfirmed,
}) => {
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
                          className="bg-gradient-to-r text-sm from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 transform hover:scale-105"
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
};

export default UsersTab;