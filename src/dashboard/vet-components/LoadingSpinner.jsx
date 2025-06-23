const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="text-gray-500 mt-4">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
