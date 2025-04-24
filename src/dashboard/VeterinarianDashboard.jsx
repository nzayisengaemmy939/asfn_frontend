import { useEffect, useState } from "react";
import SendReportForm from "../authentication/components/SendReportForm";
import { getReport, getReports, vetReport } from "../api_service/report/report";
import TrendComponent from "../authentication/components/trendComponent";
import { getProfile } from "../api_service/auth/auth";
import { HiOutlineLogout } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function VeterinarianDashboard() {
  const [previousReport, setPreviousReport] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [assigned, setAssigned] = useState([]);

  const [activeTab, setActiveTab] = useState("sendReport");
  const [profile, setProfile] = useState({});
  useEffect(() => {
    getProfile(setProfile, setIsLoading);
  }, []);
  useEffect(() => {
    if (activeTab === "previousReport") {
      getReport(setPreviousReport, setIsLoading);
    }
  }, [activeTab]);

  useEffect(() => {
    vetReport(setAssigned, setIsLoading);
  }, [activeTab]);

  const navigate=useNavigate()
  const handleLogout2 = () => {
    localStorage.removeItem("token");
    toast.success("Account removed successfully");
    setTimeout(()=>{
navigate('/')
    },2000)
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case "sendReport":
        return <SendReportForm />;

      case "previousReport":
        return (
          <div>
            {isLoading ? (
              <p>Loading...</p>
            ) : previousReport.length > 0 ? (
              <div className="space-y-4 mt-4">
                {previousReport.map((report, index) => (
                  <div
                    key={index}
                    className="border-[1px] border-gray-100 p-4 rounded-lg space-y-2  gap-10 bg-gray-50"
                  >
                    <div className="">
                      <p>
                        <span>District:</span>{" "}
                        <span className=" text-gray-500">
                          {report.district}
                        </span>
                      </p>
                      <p>
                        <span>Sector:</span>{" "}
                        <span className=" text-gray-500">{report.sector}</span>
                      </p>
                      <p>
                        <span>Cell:</span>{" "}
                        <span className=" text-gray-500">{report.cell}</span>
                      </p>
                      <p>
                        phoneNumber:
                        <span className=" text-gray-500">
                          {report.phoneNumber}
                        </span>
                      </p>
                      <p className="">
                        <span>Symptoms:</span>{" "}
                        <span className="text-gray-500 text-justify block">
                          {report.symptoms}
                        </span>
                      </p>
                      <p className="">
                        <span>Pigs Affected:</span>{" "}
                        <span className=" text-gray-500">
                          {report.numberOfPigsAffected}
                        </span>
                      </p>
                    </div>

                    <div>
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => handleEdit(report)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded ml-3"
                        onClick={() => {
                          setSelectedReportId(report._id);
                          setShowConfirmModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No report submitted yet.</p>
            )}
          </div>
        );

      case "trends":
        return (
          <div>
            <TrendComponent></TrendComponent>
          </div>
        );

      case "authorityReport":
        return (
          <div>
            <h2 className="text-xl font-semibold text-blue-700">
              Report from Authority
            </h2>

            <div className="mt-6">
              {isLoading ? (
                <p className="text-gray-500 mt-2">
                  Loading assigned reports...
                </p>
              ) : assigned.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {assigned.length > 0 ? (
                    assigned.map((report, index) => (
                      <div
                        key={index}
                        className="border-[1px] border-gray-100 p-4 rounded-lg shadow-sm bg-gray-50"
                      >
                        <p>
                          District:{" "}
                          <span className="text-gray-500">
                            {report.district}
                          </span>
                        </p>
                        <p>
                          Sector:{" "}
                          <span className="text-gray-500">{report.sector}</span>
                        </p>
                        <p>
                          Cell:{" "}
                          <span className="text-gray-500">{report.cell}</span>
                        </p>
                        <p>
                          Symptoms:{" "}
                          <span className="text-gray-500 text-justify block">
                            {report.symptoms}
                          </span>
                        </p>
                        <p>
                          Pigs Affected:{" "}
                          <span className="text-gray-500">
                            {report.numberOfPigsAffected}
                          </span>
                        </p>
                        <p>
                          Status:{" "}
                          <span className="text-gray-500">
                            {report.status || "Pending"}
                          </span>
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 mt-2">
                      No reports assigned yet.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No reports assigned yet.</p>
              )}
            </div>
          </div>
        );
    }
  };

  const handleLogout = () => {
    alert("Logging out...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-semibold text-blue-700">
          Veterineri: {profile.lastName}
        </div>
        <div className="flex gap-1 items-center">
          <HiOutlineLogout color="blue" onClick={handleLogout2} />
          <button
            onClick={handleLogout2}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-md  py-6 px-8 space-y-4 mt-4  border-[1px] border-gray-100">
        <h1 className="text-3xl font-bold text-blue-700 text-center">
          Veterinarian Dashboard
        </h1>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("sendReport")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "sendReport"
                ? "text-blue-700 border-b-2 border-blue-700"
                : "text-gray-500"
            }`}
          >
            Send Report
          </button>
          <button
            onClick={() => setActiveTab("previousReport")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "previousReport"
                ? "text-blue-700 border-b-2 border-blue-700"
                : "text-gray-500"
            }`}
          >
            Previous Report
          </button>
          <button
            onClick={() => setActiveTab("trends")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "trends"
                ? "text-blue-700 border-b-2 border-blue-700"
                : "text-gray-500"
            }`}
          >
            Trends
          </button>
          <button
            onClick={() => setActiveTab("authorityReport")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "authorityReport"
                ? "text-blue-700 border-b-2 border-blue-700"
                : "text-gray-500"
            }`}
          >
            Report
          </button>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} />

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
