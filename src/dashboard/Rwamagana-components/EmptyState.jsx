import { FiFileText, FiPlus } from "react-icons/fi";

const EmptyState = ({ 
  title, 
  description, 
  actionText, 
  onAction,
  showAction = false 
}) => {
  return (
    <div className="text-center py-12">
      <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 text-lg mb-4">{title}</p>
      {description && (
        <p className="text-gray-400 text-sm mb-6">{description}</p>
      )}
      {showAction && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;