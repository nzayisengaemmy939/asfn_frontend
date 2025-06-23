import { useState, useEffect } from "react";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiEdit3, 
  FiSave, 
  FiX, 
  FiCamera,
  FiShield,
  FiCalendar,
  FiActivity,
  FiLoader
} from "react-icons/fi";
import axios from "axios";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Get user ID from token
  const getUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch {
      return null;
    }
  };

  // Fetch user data by ID
  const getUserById = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/get/profile/${userId}`
      );
      setUserData(response.data.data);
      setEditForm(response.data.data);
      // console.log("User data:", response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (updatedData) => {
    const userId = getUserId();
    if (!userId) throw new Error("No user ID found");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/auth/update/profile/${userId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Load user data on component mount
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      getUserById(userId);
    } else {
      console.error("No user ID found in token");
      // You might want to redirect to login page here
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateUserProfile(editForm);
      
      setUserData({ ...editForm });
      setIsEditing(false);
      console.log("Profile updated successfully");
      // You can add a toast notification here
    } catch (error) {
      console.error("Error updating profile:", error);
      // You can add an error toast notification here
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({ ...userData });
    setIsEditing(false);
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "authority":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "veterinarian":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "farmer":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Unable to load profile data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-sm bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-6">
              {/* Profile Image */}
              <div className="relative mb-4 sm:mb-0">
                <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  {userData.profileImage ? (
                    <img 
                      src={userData.profileImage} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200">
                    <FiCamera className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="sm:ml-6 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {userData.firstName || "N/A"} {userData.lastName || ""}
                    </h1>
                    <div className="flex items-center space-x-4 mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(userData.role)}`}>
                        <FiShield className="w-4 h-4 mr-2" />
                        {userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : "User"}
                      </span>
                      <span className="text-gray-500 text-sm flex items-center">
                        <FiActivity className="w-4 h-4 mr-1" />
                        Last active: {userData.lastActive ? formatDate(userData.lastActive) : "N/A"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Edit Button */}
                  <div className="flex space-x-3">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                      >
                        <FiEdit3 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50"
                        >
                          <FiSave className="w-4 h-4" />
                          <span>{isSaving ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                        >
                          <FiX className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FiUser className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={editForm.firstName || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{userData.firstName || "N/A"}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={editForm.lastName || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{userData.lastName || "N/A"}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiMail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editForm.email || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{userData.email || "N/A"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiPhone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{userData.phone || "N/A"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FiMapPin className="w-5 h-5 mr-2 text-blue-600" />
              Location Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                {isEditing ? (
                  <select
                    name="district"
                    value={editForm.district || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select District</option>
                    <option value="Kigali">Kigali</option>
                    <option value="Gasabo">Gasabo</option>
                    <option value="Kicukiro">Kicukiro</option>
                    <option value="Nyarugenge">Nyarugenge</option>
                  </select>
                ) : (
                  <p className="text-gray-900 py-2">{userData.district || "N/A"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sector
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="sector"
                    value={editForm.sector || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{userData.sector || "N/A"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cell
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="cell"
                    value={editForm.cell || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{userData.cell || "N/A"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FiCalendar className="w-5 h-5 mr-2 text-blue-600" />
              Account Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FiCalendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(userData.joinedDate || userData.createdAt)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FiShield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Account Status</p>
                <p className="text-lg font-semibold text-green-600">
                  {userData.status || "Active"}
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FiActivity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Role</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {userData.role || "User"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}