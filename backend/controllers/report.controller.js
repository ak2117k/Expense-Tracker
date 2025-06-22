const Expense = require("../models/expense.model.js");
const mongoose = require("mongoose");
const moment = require("moment");

// GET /api/reports/dashboard
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

    // Sort trend by date
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

module.exports = { getDashboardReport };
