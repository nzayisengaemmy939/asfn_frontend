import { HiOutlineLogout, HiOutlineX } from "react-icons/hi";
import { FiFileText, FiTrendingUp, FiUser, FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { BiHome } from "react-icons/bi";
import { toast } from "react-toastify";
import { getUserId } from "../../api_service/auth/auth";
import { BsPeople } from "react-icons/bs";
import { MdReport } from "react-icons/md";

const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  activeTab, 
  setActiveTab, 
  profile 
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Account removed successfully");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const menuItems = [
    { id: "Home", label: "Home", icon: BiHome },
    // { id: "sendReport", label: "Send Report", icon: FiPlus },
    // { id: "myReports", label: "My Reports", icon: FiFileText },
     { id: "users", label: "Users", icon:BsPeople },
    { id: "Reports", label: "Reports", icon:MdReport },
    // { id: "authorityReport", label: "Assigned Reports", icon: FiFileText },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full text-sm w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Link to={`/profile/${getUserId()}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {profile.lastName || "Veterinarian"}
                    </h3>
                    <p className="text-sm text-gray-500">Veterinarian</p>
                  </div>
                </div>
              </Link>
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <HiOutlineX className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Logout Section */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-sm"
            >
              <HiOutlineLogout className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;