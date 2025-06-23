import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addBudget, deleteBudget, getBudgets } from "../api/budget";
import { getExpenses } from "../api/expense";

const initialBudget = {
  category: "",
  amount: "",
};

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState(initialBudget);
  const [expenses, setExpenses] = useState([]);
  const [alerts, setAlerts] = useState({});
  const dispatch = useDispatch();

  const fetchBudgetsAndExpenses = async () => {
    try {
      const [budgetData, expenseData] = await Promise.all([
        getBudgets(),
        getExpenses(),
      ]);
      console.log("budget data", budgetData);
      console.log("Expense Data", expenseData);
      setBudgets(budgetData);
      setExpenses(expenseData);
      computeAlerts(budgetData, expenseData);
    } catch (err) {
      console.error("Error fetching budget or expense:", err);
    }
  };

  useEffect(() => {
    fetchBudgetsAndExpenses();
  }, [dispatch]);

  const computeAlerts = (budgets, expenses) => {
    const categoryTotals = {};
    expenses.forEach((exp) => {
      categoryTotals[exp.category] =
        (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
    });

    const alertStatus = {};
    budgets.forEach((b) => {
      const totalSpent = categoryTotals[b.category] || 0;
      const percent = (totalSpent / b.limit) * 100;

      if (percent >= 100) {
        alertStatus[b.category] = {
          type: "danger",
          message: `Over budget! You spent ₹${totalSpent} in ${b.category} (limit: ₹${b.limit})`,
        };
      } else if (percent >= 80) {
        alertStatus[b.category] = {
          type: "warning",
          message: `You're nearing your ${b.category} budget! ₹${totalSpent} of ₹${b.limit} spent.`,
        };
      }
    });

    setAlerts(alertStatus);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      await addBudget(formData);
      setFormData(initialBudget);
      fetchBudgetsAndExpenses();
    } catch (err) {
      console.error("Error adding budget:", err);
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
      await deleteBudget(id);
      fetchBudgetsAndExpenses();
    } catch (err) {
      console.error("Error deleting budget:", err);
    }
  };

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">
        Manage Budgets
      </h2>

      <form
        onSubmit={handleAddBudget}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-md mb-6"
      >
        <div>
          <label className="text-sm">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Shopping">Shopping</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
          </select>
        </div>

        <div>
          <label className="text-sm">Monthly Limit (₹)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <button
          type="submit"
          className="md:col-span-2 py-2 mt-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Add Budget
        </button>
      </form>

      {/* Alerts */}
      {Object.keys(alerts).length > 0 && (
        <div className="space-y-3 mb-6">
          {Object.entries(alerts).map(([category, alert]) => (
            <div
              key={category}
              className={`p-3 rounded-xl ${
                alert.type === "danger"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              <strong>{category}:</strong> {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* Budget List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Your Budgets</h3>
        {budgets.length === 0 ? (
          <p className="text-gray-600">No budgets set yet.</p>
        ) : (
          <ul className="space-y-3">
            {budgets.map((budget) => (
              <li
                key={budget._id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <div>
                  <strong>{budget.category}</strong>: ₹{budget.limit}
                </div>
                <button
                  onClick={() => handleDeleteBudget(budget._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Budget;
