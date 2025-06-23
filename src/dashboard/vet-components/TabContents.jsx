import SendReportTab from "./SendReportTab";
import MyReportsTab from "./MyReportsTab";

import AuthorityReportsTab from "./AuthorityReportsTab";
import HomeTab from "./HomeTab";
import UsersTab from "../vet-components/UserTab";
import ReportTab from "./ReportTab";

const TabContents = ({
 activeTab,
  setActiveTab,
  previousReport,
  assigned,
  isLoading,
  handleEdit,
  setSelectedReportId,
  setShowConfirmModal,

  // Props for UsersTab
 
}) => {


  const renderTabContent = (...props) => {
    switch (activeTab) {
      case "Home":
        return <HomeTab />;
        
   case "users":
  return (
    <UsersTab
    
    />
  );
   case "Reports":

   return (
    <>
    <ReportTab />
    
    </>
  );

        
      // case "myReports":
      //   return (
      //     <MyReportsTab
      //       previousReport={previousReport}
      //       isLoading={isLoading}
      //       handleEdit={handleEdit}
      //       setSelectedReportId={setSelectedReportId}
      //       setShowConfirmModal={setShowConfirmModal}
      //       setActiveTab={setActiveTab}
      //     />
      //   );
        
      // case "trends":
      //   return <TrendsTab />;
        
      case "authorityReport":
        return (
          <AuthorityReportsTab
            assigned={assigned}
            isLoading={isLoading}
          />
        );
        
      default:
        return null;
    }
  };

  return renderTabContent();
};

export default TabContents;