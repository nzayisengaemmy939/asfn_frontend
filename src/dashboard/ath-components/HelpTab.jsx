import { FiHelpCircle } from "react-icons/fi";

const HelpTab = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="text-center">
        <FiHelpCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Help & Support
        </h3>
        <p className="text-gray-600 mb-6">
          You can initiate interventions here.
        </p>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HelpTab;