import { axiosInstance } from "../lib/axios";
// GET all expenses
export const getExpenses = async () => {
  const res = await axiosInstance.get("/expense");
  return res.data;
};

// ADD a new expense
export const addExpense = async (expenseData) => {
  const res = await axiosInstance.post("/expense", expenseData);
  return res.data;
};

// UPDATE expense
export const updateExpense = async (id, updatedData) => {
  const res = await axiosInstance.put(`/expense/${id}`, updatedData);
  return res.data;
};

// DELETE expense
export const deleteExpense = async (id) => {
  const res = await axiosInstance.delete(`/expense/${id}`);
  return res.data;
};
