
// 1. Main TabContent.jsx (Updated)
import ReportsTab from '../ntunga-components/ReportsTab';
import UsersTab from '../ntunga-components/UsersTab';

import HomeTab from '../Rwamagana-components/HomeTab';
import VetReportForm from"../../authentication/components/VetReportForm"
import GuidanceComponent from './AddGuidance';


const TabContent = ({ activeTab, ...props }) => {
  const renderTabContent = () => {
    switch (activeTab) {
          case "Home":
        return <HomeTab />;
      case "reports":
        return <ReportsTab {...props} />;
  
      case "users":
        return <UsersTab {...props} />;
      case "Send report":
        return <VetReportForm />;
      // case "trends":
      //   return <TrendsTab />;
      case "guidance":
      return <><GuidanceComponent /></>;
      default:
        return null;
    }
  };

  return renderTabContent();
};

export default TabContent;