import { axiosInstance } from "../lib/axios";

export const getDashboardReport = async () => {
  const res = await axiosInstance.get("/reports/");
  return res.data;
};
