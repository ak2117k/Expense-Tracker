const Expense = require("../models/expense.model.js");
const Budget = require("../models/budget.model.js");
const mongoose = require("mongoose");
const moment = require("moment");
const db = require("../config/mysql");

// ------------------ Dashboard Report (MongoDB) ------------------ //

const getDashboardReport = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    // Get current month's expenses
    const expenses = await Expense.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Total spent
    const totalSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0);

    // Category-wise spending (for pie chart)
    const categoryMap = {};
    for (let exp of expenses) {
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
    }
    const categoryWise = Object.keys(categoryMap).map((cat) => ({
      name: cat,
      value: categoryMap[cat],
    }));

    // Top category
    const topCategory = categoryWise.length
      ? categoryWise.reduce((a, b) => (a.value > b.value ? a : b)).name
      : null;

    // Top 3 payment methods
    const paymentMethodCounts = {};
    for (let exp of expenses) {
      paymentMethodCounts[exp.paymentMethod] =
        (paymentMethodCounts[exp.paymentMethod] || 0) + 1;
    }

    const topMethods = Object.entries(paymentMethodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((entry) => entry[0]);

    // Line chart: daily spending
    const dateMap = {};
    for (let exp of expenses) {
      const date = moment(exp.date).format("YYYY-MM-DD");
      dateMap[date] = (dateMap[date] || 0) + exp.amount;
    }

    const trend = Object.keys(dateMap).map((date) => ({
      date,
      amount: dateMap[date],
    }));

    trend.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({
      totalSpent,
      topCategory,
      topMethods,
      categoryWise,
      trend,
    });
  } catch (err) {
    console.error("Dashboard Report Error:", err);
    res.status(500).json({ message: "Failed to generate dashboard report" });
  }
};

// ------------------ Monthly Reports (MySQL) ------------------ //

const insertMonthlyReport = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();

    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const expenses = await Expense.find({
      userId,
      date: { $gte: firstDay, $lte: lastDay },
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const categoryTotals = {};
    for (let exp of expenses) {
      categoryTotals[exp.category] =
        (categoryTotals[exp.category] || 0) + exp.amount;
    }

    const topCategory =
      Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

    const budgets = await Budget.find({ userId });
    const overbudgetCategories = budgets
      .filter((b) => categoryTotals[b.category] > b.limit)
      .map((b) => b.category);

    // Insert into MySQL
    await db.query(
      `INSERT INTO monthly_reports 
       (user_id, month, year, total_spent, top_category, overbudget_categories)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        month,
        year,
        totalSpent,
        topCategory,
        JSON.stringify(overbudgetCategories),
      ]
    );

    res.status(200).json({ message: "Monthly report inserted successfully" });
  } catch (err) {
    console.error("Error inserting monthly report:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// const getMonthlyReports = async (req, res) => {
//   try {
//     console.log("get monthly reports hitted");

//     const userId = "12345";

//     const [rows] = await db.query(
//       `SELECT month, year, total_spent, top_category, overbudget_categories
//        FROM monthly_reports
//        WHERE user_id = ?
//        ORDER BY year DESC,
//                 FIELD(month, 'January','February','March','April','May','June','July','August','September','October','November','December')
//        LIMIT 3`,
//       [userId]
//     );

//     const formatted = rows.map((row) => ({
//       ...row,
//       overbudgetCategories: (() => {
//         try {
//           return JSON.parse(row.overbudget_categories || "[]");
//         } catch (e) {
//           console.warn(
//             "⚠️ Invalid JSON in overbudget_categories:",
//             row.overbudget_categories
//           );
//           return [];
//         }
//       })(),
//     }));

//     console.log("formatted data", formatted);

//     res.status(200).json(formatted);
//   } catch (err) {
//     console.error("Error fetching reports:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

//Monthly Reports using MongoDb

const getMonthlyReports = async (req, res) => {
  try {
    const userId = req.user._id;

    const currentMonth = moment().format("MMMM");
    const year = moment().year();
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const expenses = await Expense.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const budgets = await Budget.find({ userId });

    const expenseMap = {};
    expenses.forEach((exp) => {
      expenseMap[exp.category] = (expenseMap[exp.category] || 0) + exp.amount;
    });

    const budgetMap = {};
    budgets.forEach((b) => {
      budgetMap[b.category] = (budgetMap[b.category] || 0) + b.amount;
    });

    const allCategories = new Set([
      ...Object.keys(budgetMap),
      ...Object.keys(expenseMap),
    ]);

    const comparison = [];
    let totalSpent = 0;
    let totalBudget = 0;

    allCategories.forEach((category) => {
      const spent = expenseMap[category] || 0;
      const budgeted = budgetMap[category] || 0;

      totalSpent += spent;
      totalBudget += budgeted;

      comparison.push({
        category,
        spent,
        budgeted,
        difference: spent - budgeted,
        status: spent > budgeted ? "Over Budget" : "Under Budget",
      });
    });

    res.status(200).json({
      currentMonth,
      year,
      totalSpent,
      totalBudget,
      remaining: totalBudget - totalSpent,
      comparison,
    });
  } catch (err) {
    console.error("Error generating Mongo report", err);
    res.status(500).json({ message: "Error generating report" });
  }
};

// ------------------ Export All ------------------ //

module.exports = {
  getDashboardReport,
  insertMonthlyReport,
  getMonthlyReports,
};
