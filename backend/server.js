const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT;
const authRoutes = require("./api/auth.route.js");
const expenseRoutes = require("./api/expense.route.js");
const budgetRoutes = require("./api/budget.route.js");
const dashboardReportRoutes = require("./api/report.dashboard.route.js");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://expense-tracker-rhuv.vercel.app",
    credentials: true,
  })
);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/budgets", budgetRoutes);
app.use("/api/v1/reports", dashboardReportRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

connectDB()
  .then(() => {
    app.listen(PORT, (err) => {
      if (err) {
        console.error("Error starting the server:", err);
        return;
      }
      console.log(`Server is running at ${PORT}`);
    });
  })
  .catch((error) => console.log("error connecting db", error));
