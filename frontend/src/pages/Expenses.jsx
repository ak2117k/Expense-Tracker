import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../api/expense.js";

const initialExpense = {
  amount: "",
  category: "",
  date: "",
  paymentMethod: "",
  notes: "",
};

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState(initialExpense);
  const [editingId, setEditingId] = useState(null);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateExpense(editingId, formData);
        setEditingId(null);
      } else {
        await addExpense(formData);
      }
      setFormData(initialExpense);
      fetchData();
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setFormData({
      amount: expense.amount,
      category: expense.category,
      date: expense.date?.slice(0, 10),
      paymentMethod: expense.paymentMethod,
      notes: expense.notes,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialExpense);
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchData();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">
        Manage Expenses
      </h2>

      {/* Expense Form */}
      <form
        onSubmit={handleAddOrUpdate}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-md mb-6"
      >
        <div>
          <label className="text-sm">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

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
          <label className="text-sm">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="text-sm">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="Debit Card">Debit Card</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm">Notes (optional)</label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-4">
          <button
            type="submit"
            className="py-2 bg-indigo-600 text-white rounded-xl px-6 hover:bg-indigo-700 transition"
          >
            {editingId ? "Update Expense" : "Add Expense"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="py-2 bg-gray-400 text-white rounded-xl px-6 hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Expense List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Your Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-gray-600">No expenses added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="py-2 px-3 border">Amount</th>
                  <th className="py-2 px-3 border">Category</th>
                  <th className="py-2 px-3 border">Date</th>
                  <th className="py-2 px-3 border">Method</th>
                  <th className="py-2 px-3 border">Notes</th>
                  <th className="py-2 px-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp._id}>
                    <td className="py-2 px-3 border">₹{exp.amount}</td>
                    <td className="py-2 px-3 border">{exp.category}</td>
                    <td className="py-2 px-3 border">
                      {exp.date?.slice(0, 10)}
                    </td>
                    <td className="py-2 px-3 border">{exp.paymentMethod}</td>
                    <td className="py-2 px-3 border">{exp.notes}</td>
                    <td className="py-2 px-3 border space-x-2">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenses;
