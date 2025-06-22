const express = require("express");
const router = express.Router();
const protectRoute = require("../middlewares/auth.middleware.js");
const {
  createExpense,
  getUserExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expense.controller.js");

router.use(protectRoute);

router.post("/", createExpense);
router.get("/", getUserExpenses);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
