const Expense = require("../models/expense.model.js");

// Create Expense
const createExpense = async (req, res) => {
  try {
    const { amount, category, date, paymentMethod, notes } = req.body;

    const newExpense = new Expense({
      userId: req.user._id,
      amount,
      category,
      date,
      paymentMethod,
      notes,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(500).json({ message: "Error creating expense" });
  }
};

// Get All Expenses for Logged-in User
const getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses" });
  }
};

// Update Expense
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: "Error updating expense" });
  }
};

// Delete Expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting expense" });
  }
};

module.exports = {
  createExpense,
  getUserExpenses,
  updateExpense,
  deleteExpense,
};
