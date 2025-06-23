import React, { useState } from "react";
import { registerReport } from "../../api_service/report/report";
import { ToastContainer } from "react-toastify";

const VetReportForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previousReport, setPreviousReport] = useState(false);
  const [report, setReport] = useState({
    district: "",
    sector: "",
    cell: "",
    phoneNumber: "",
    symptoms: "",
    pigsDied: "",
    pigsRecovered: "",
  });

  const handleChange = (e) => {
    setReport({ ...report, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerReport(report, setIsLoading);
      setPreviousReport(report);
      setReport({
        district: "",
        sector: "",
        cell: "",
        phoneNumber: "",
        symptoms: "",
        pigsDied: "",
        pigsRecovered: "",
      });
    } catch (error) {
      console.error("Report submission failed:", error);
    }
  };

  return (
    <div>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="district"
          value={report.district}
          placeholder="District "
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="sector"
          value={report.sector}
          placeholder="Sector "
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="cell"
          value={report.cell}
          placeholder="Cell"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          name="phoneNumber"
          value={report.phoneNumber}
          placeholder="Phone Number (e.g. +250)"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="symptoms"
          value={report.symptoms}
          onChange={handleChange}
          required
          placeholder="Symptoms (e.g. Fever, loss of appetite...)"
          rows="3"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <input
          type="number"
          name="pigsDied"
          value={report.pigsDied}
          onChange={handleChange}
          required
          min={0}
          placeholder="Number of Pigs Died (e.g. 2)"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          name="pigsRecovered"
          value={report.pigsRecovered}
          onChange={handleChange}
          required
          min={0}
          placeholder="Number of Pigs Recovered (e.g. 3)"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 rounded-md transition duration-200 font-semibold`}
        >
          {isLoading ? "Submitting..." : "Submit ASF Report"}
        </button>
      </form>
    </div>
  );
};

export default VetReportForm;