const Budget = require("../models/budget.model.js");

// Create or Update Budget for a category
const setOrUpdateBudget = async (req, res) => {
  try {
    const { category, amount } = req.body;
    console.log("Incoming Budget Data:", req.body);
    const filter = { userId: req.user._id, category };
    const update = { limit: amount };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const budget = await Budget.findOneAndUpdate(filter, update, options);
    res.status(200).json(budget);
  } catch (err) {
    console.log("Error in setOrUpdateBudget controller function", err);
    res.status(500).json({ message: "Error saving budget" });
  }
};

// Get all budgets for user
const getUserBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id }).sort({
      category: 1,
    });
    console.log(budgets);
    res.status(200).json(budgets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching budgets" });
  }
};

// Delete budget for a category
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!budget) return res.status(404).json({ message: "Budget not found" });

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting budget" });
  }
};

module.exports = {
  setOrUpdateBudget,
  getUserBudgets,
  deleteBudget,
};
