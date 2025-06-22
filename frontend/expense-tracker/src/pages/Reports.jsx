import { useEffect, useState } from "react";
import { getMonthlyReports } from "../api/report.monthly.js";

const MonthlyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getMonthlyReports();
        setReports(data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">
        Monthly Summary Reports
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-600">No reports found.</p>
      ) : (
        <div className="grid gap-4">
          {reports.map((report, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-xl p-4 border border-indigo-100"
            >
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                {report.month} {report.year}
              </h3>
              <p className="text-gray-800 mb-1">
                <strong>Total Spent:</strong> ₹{report.total_spent}
              </p>
              <p className="text-gray-800 mb-1">
                <strong>Top Category:</strong> {report.top_category || "N/A"}
              </p>
              <div>
                <strong>Overbudget Categories:</strong>
                {report.overbudgetCategories.length === 0 ? (
                  <span className="ml-1 text-gray-500">None</span>
                ) : (
                  <ul className="list-disc list-inside ml-4 text-sm text-red-600">
                    {report.overbudgetCategories.map((cat, i) => (
                      <li key={i}>{cat}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonthlyReports;
