import { HiOutlineMenu } from "react-icons/hi";

const Header = ({ setSidebarOpen }) => {
  return (
    <header className="fixed top-0 z-50 bg-white shadow-sm border-b border-gray-200 p-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <HiOutlineMenu className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ntunga Veterinarian Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage reports, users, and system operations
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;