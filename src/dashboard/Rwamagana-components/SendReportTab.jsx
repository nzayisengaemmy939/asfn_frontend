import VetReportForm from "../../authentication/components/VetReportForm"
const SendReportTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Submit New Report
          </h2>
        </div>
        <VetReportForm />
      </div>
    </div>
  );
};

export default SendReportTab;