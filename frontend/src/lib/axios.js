import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL:
  //   import.meta.env.NODE_ENV === "development"
  //     ? "http://localhost:4000/api/v1"
  //     : "/api/v1",

  baseURL: "https://expense-tracker-37n6.onrender.com/api/v1",
  withCredentials: true,
});
