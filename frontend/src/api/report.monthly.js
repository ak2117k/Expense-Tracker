import { axiosInstance } from "../lib/axios";
export const getMonthlyReports = async () => {
  const res = await axiosInstance.get("/reports/monthly", {
    withCredentials: true,
  });
  return res.data;
};
