import { useEffect, useState } from "react";
import { getMonthlyReports } from "../api/report.monthly.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const MonthlyReports = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getMonthlyReports();
        setReport(data);
      } catch (err) {
        console.error("Error fetching report", err);
      }
    };
    fetchReport();
  }, []);

  if (!report) return <div className="text-center">Loading...</div>;

  const barData = {
    labels: report.comparison.map((d) => d.category),
    datasets: [
      {
        label: "Budgeted",
        data: report.comparison.map((d) => d.budgeted),
        backgroundColor: "#36A2EB",
      },
      {
        label: "Spent",
        data: report.comparison.map((d) => d.spent),
        backgroundColor: "#FF6384",
      },
    ],
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Monthly Report - {report.currentMonth} {report.year}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-sm">Total Budget</p>
          <p className="text-xl font-semibold">₹{report.totalBudget}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <p className="text-sm">Total Spent</p>
          <p className="text-xl font-semibold">₹{report.totalSpent}</p>
        </div>
        <div
          className={`p-4 rounded shadow ${
            report.remaining < 0 ? "bg-red-200" : "bg-green-200"
          }`}
        >
          <p className="text-sm">Remaining</p>
          <p className="text-xl font-semibold">₹{report.remaining}</p>
        </div>
      </div>

      <Bar data={barData} />

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">Category-wise Analysis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {report.comparison.map((c) => (
            <div
              key={c.category}
              className="border p-4 rounded shadow-sm flex flex-col"
            >
              <div className="text-lg font-semibold">{c.category}</div>
              <div>Budgeted: ₹{c.budgeted}</div>
              <div>Spent: ₹{c.spent}</div>
              <div
                className={`${
                  c.status === "Over Budget" ? "text-red-600" : "text-green-600"
                }`}
              >
                {c.status} by ₹{Math.abs(c.difference)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyReports;
