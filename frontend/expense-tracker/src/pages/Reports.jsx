import React, { useEffect, useState } from "react";

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // TODO: Replace this with an API call to GET /sql-reports or similar
    const sampleReports = [
      {
        _id: "1",
        month: "March 2025",
        totalSpent: 18000,
        topCategory: "Rent",
        overbudgetCategories: ["Shopping", "Food"],
      },
      {
        _id: "2",
        month: "April 2025",
        totalSpent: 20500,
        topCategory: "Food",
        overbudgetCategories: ["Food"],
      },
      {
        _id: "3",
        month: "May 2025",
        totalSpent: 19200,
        topCategory: "Travel",
        overbudgetCategories: [],
      },
    ];

    setReports(sampleReports);
  }, []);

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">
        Monthly Reports
      </h2>

      {reports.length === 0 ? (
        <p className="text-gray-600">No reports available yet.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                {report.month}
              </h3>
              <p>
                <span className="font-medium">Total Spent:</span> ₹
                {report.totalSpent}
              </p>
              <p>
                <span className="font-medium">Top Category:</span>{" "}
                {report.topCategory}
              </p>
              <p>
                <span className="font-medium">Overbudget Categories:</span>{" "}
                {report.overbudgetCategories.length > 0
                  ? report.overbudgetCategories.join(", ")
                  : "None"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
