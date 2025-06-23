import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ReportsTable from "./ReportsTable";

const AuthorityReportsTab = ({ assigned, isLoading }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Assigned Reports from Authority
          </h2>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading assigned reports..." />
        ) : assigned.length > 0 ? (
          <ReportsTable
            reports={assigned}
            showActions={false}
            showRepliesButton={false}
          />
        ) : (
          <EmptyState
            title="No reports assigned yet."
            showAction={false}
          />
        )}
      </div>
    </div>
  );
};

export default AuthorityReportsTab;