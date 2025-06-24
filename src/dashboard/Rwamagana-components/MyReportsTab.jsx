import { useState } from "react";
import SearchBar from "./SearchBar";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ReportsTable from "./ReportsTable";
import ReplySection from "./ReplySection";

const MyReportsTab = ({
  previousReport,
  isLoading,
  handleEdit,
  setSelectedReportId,
  setShowConfirmModal,
  setActiveTab
}) => {
  const [expandedReports, setExpandedReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (id) => {
    setExpandedReports((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleDelete = (reportId) => {
    setSelectedReportId(reportId);
    setShowConfirmModal(true);
  };

  const filteredReports = previousReport.filter(report =>
    report.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.cell.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Reports
          </h2>
          <div className="flex items-center space-x-4">
            <SearchBar 
              placeholder="Search reports..." 
              onSearch={setSearchTerm}
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading reports..." />
        ) : filteredReports.length > 0 ? (
          <>
            <ReportsTable
              reports={filteredReports}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleReplies={toggleExpand}
              expandedReports={expandedReports}
              showRepliesButton={true}
            />
            <ReplySection 
              reports={filteredReports}
              expandedReports={expandedReports}
            />
          </>
        ) : searchTerm ? (
          <EmptyState
            title="No reports found"
            description={`No reports match "${searchTerm}". Try adjusting your search terms.`}
            showAction={false}
          />
        ) : (
          <EmptyState
            title="No reports submitted yet."
            description="Get started by submitting your first veterinary report."
            actionText="Submit New Report"
            onAction={() => setActiveTab("sendReport")}
            showAction={true}
          />
        )}
      </div>
    </div>
  );
};

export default MyReportsTab;