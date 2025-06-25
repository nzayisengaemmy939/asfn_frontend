import React from "react";
import { BiChevronDown, BiDownload } from "react-icons/bi";

const ReportsFilters = ({
  tabConfigs,
  activeTab,
  setActiveTab,
  availableCells,
  selectedCell,
  setSelectedCell,
  timeFilterOptions,
  selectedTimeFilter,
  setSelectedTimeFilter,
  downloadPDF,
  pdfLoading,
  currentReports,
}) => {
  return (
    <>
      {/* Report Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabConfigs.map((tab) => (
          <button
            key={tab.key}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Download Section */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Cell Filter Dropdown */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Cell
          </label>
          <div className="relative w-full sm:w-64">
            <select
              value={selectedCell}
              onChange={(e) => setSelectedCell(e.target.value)}
              className="w-full px-4 py-2 pr-8 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="all">All Cells</option>
              {availableCells.map((cell) => (
                <option key={cell} value={cell}>
                  {cell}
                </option>
              ))}
            </select>
            <BiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Time Filter Dropdown */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Time
          </label>
          <div className="relative w-full sm:w-64">
            <select
              value={selectedTimeFilter}
              onChange={(e) => setSelectedTimeFilter(e.target.value)}
              className="w-full px-4 py-2 pr-8 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none cursor-pointer"
            >
              {timeFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <BiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* PDF Download Button */}
        <div className="flex items-end">
          <button
            onClick={downloadPDF}
            disabled={pdfLoading || currentReports.length === 0}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200
              ${
                pdfLoading || currentReports.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105"
              }
            `}
          >
            {pdfLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating PDF...
              </>
            ) : (
              <>
                <BiDownload className="w-4 h-4" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {currentReports.length}
          </span>{" "}
          reports
          {activeTab !== "all" && (
            <span>
              {" "}
              from{" "}
              <span className="font-semibold text-blue-600">
                {activeTab}s
              </span>
            </span>
          )}
          {selectedCell !== "all" && (
            <span>
              {" "}
              in{" "}
              <span className="font-semibold text-green-600">
                {selectedCell}
              </span>{" "}
              cell
            </span>
          )}
          {selectedTimeFilter !== "all" && (
            <span>
              {" "}
              for{" "}
              <span className="font-semibold text-purple-600">
                {timeFilterOptions
                  .find((option) => option.value === selectedTimeFilter)
                  ?.label.toLowerCase()}
              </span>
            </span>
          )}
        </p>
      </div>
    </>
  );
};

export default ReportsFilters;