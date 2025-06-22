import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import { getDashboardReport } from "../api/report.dashboard";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const COLORS = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"];

const Dashboard = () => {
  const [totalSpent, setTotalSpent] = useState(0);
  const [topCategory, setTopCategory] = useState("");
  const [topMethods, setTopMethods] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardReport();
        setTotalSpent(data.totalSpent);
        setTopCategory(data.topCategory);
        setTopMethods(data.topMethods);
        setCategoryData(data.categoryWise);
        setTrendData(data.trend);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  const pieData = {
    labels: categoryData.map((c) => c.name),
    datasets: [
      {
        data: categoryData.map((c) => c.value),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: trendData.map((t) => t.date),
    datasets: [
      {
        label: "Spending",
        data: trendData.map((t) => t.amount),
        fill: false,
        borderColor: "#4F46E5",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">
        Spending Dashboard
      </h2>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="text-sm text-gray-500 mb-1">
            Total Spent (This Month)
          </h4>
          <p className="text-2xl font-bold text-indigo-600">₹{totalSpent}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="text-sm text-gray-500 mb-1">Top Spending Category</h4>
          <p className="text-lg font-semibold">{topCategory}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="text-sm text-gray-500 mb-1">Top Payment Methods</h4>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {topMethods.map((method, idx) => (
              <li key={idx}>{method}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h4 className="text-lg font-semibold mb-4">Spending by Category</h4>
          <Pie data={pieData} />
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h4 className="text-lg font-semibold mb-4">Spending Over Time</h4>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
