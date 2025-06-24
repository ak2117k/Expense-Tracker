import { useEffect, useState } from "react";
import { getMonthlyReports } from "../api/report.monthly";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MonthlyReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getMonthlyReports();
        setReport(data);
      } catch (err) {
        console.error("Error fetching report", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (!report)
    return <div className="text-center text-red-600">No data available.</div>;

  const barData = {
    labels: report.comparison.map((d) => d.category),
    datasets: [
      {
        label: "Budgeted",
        data: report.comparison.map((d) => d.budgeted),
        backgroundColor: "#60A5FA", // blue-400
      },
      {
        label: "Spent",
        data: report.comparison.map((d) => d.spent),
        backgroundColor: "#F87171", // red-400
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `₹${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Monthly Report – {report.currentMonth} {report.year}
      </h2>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-xl shadow">
          <h4 className="text-gray-600 font-medium">Total Budget</h4>
          <p className="text-xl font-bold text-blue-700">
            ₹{report.totalBudget}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl shadow">
          <h4 className="text-gray-600 font-medium">Total Spent</h4>
          <p className="text-xl font-bold text-red-700">₹{report.totalSpent}</p>
        </div>
        <div
          className={`p-4 rounded-xl shadow ${
            report.remaining < 0 ? "bg-red-100" : "bg-green-100"
          }`}
        >
          <h4 className="text-gray-600 font-medium">Remaining</h4>
          <p
            className={`text-xl font-bold ${
              report.remaining < 0 ? "text-red-600" : "text-green-700"
            }`}
          >
            ₹{report.remaining}
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          Budget vs Spending
        </h3>
        <Bar data={barData} options={barOptions} />
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Category Insights
        </h3>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {report.comparison.map((c) => (
            <div
              key={c.category}
              className="border p-4 rounded-lg shadow hover:shadow-md transition duration-200 bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">{c.category}</span>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    c.status === "Over Budget"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Spent: ₹{c.spent} / ₹{c.budgeted} (
                {c.status === "Over Budget" ? "+" : "-"}₹
                {Math.abs(c.difference)})
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded">
                <div
                  className={`h-full rounded ${
                    c.status === "Over Budget" ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min((c.spent / c.budgeted) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyReports;
