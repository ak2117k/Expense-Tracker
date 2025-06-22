import { axiosInstance } from "../lib/axios";
export const getBudgets = async () => {
  const res = await axiosInstance.get("/budgets");
  return res.data;
};

export const addBudget = async (budgetData) => {
  const res = await axiosInstance.post("/budgets", budgetData);
  return res.data;
};

export const deleteBudget = async (id) => {
  const res = await axiosInstance.delete(`/budgets/${id}`);
  return res.data;
};
