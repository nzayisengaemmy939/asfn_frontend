import React, { useState } from "react";
import { updateProfile } from "../../api_service/auth/auth";
import { toast } from "react-toastify";

const EditUser = ({ user, setShowEditModal }) => {
  const [editUserData, setEditUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      await updateProfile(user._id, editUserData, setIsLoading);
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update user ❌");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full space-y-4">
        <h2 className="text-lg font-semibold text-blue-700">Edit User</h2>
        <div className="space-y-2">
          <input
            type="text"
            value={editUserData.firstName}
            onChange={(e) =>
              setEditUserData({ ...editUserData, firstName: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
          />
           <input
            type="text"
            value={editUserData.lastName}
            onChange={(e) =>
              setEditUserData({ ...editUserData, lastName: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
          />
          <input
            type="email"
            value={editUserData.email}
            onChange={(e) =>
              setEditUserData({ ...editUserData, email: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
          />
          <select
            value={editUserData.role}
            onChange={(e) =>
              setEditUserData({ ...editUserData, role: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="">{user.role}</option>
           
            <option value="veterinarian">veterinarian</option>
            <option value="farmer">farmer</option>
            <option value="authority">authority</option>
          </select>
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
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
