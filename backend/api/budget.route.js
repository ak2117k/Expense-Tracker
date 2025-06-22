const express = require("express");
const router = express.Router();
const protectRoute = require("../middlewares/auth.middleware.js");
const {
  setOrUpdateBudget,
  getUserBudgets,
  deleteBudget,
} = require("../controllers/budget.controller.js");

router.use(protectRoute);

router.post("/", setOrUpdateBudget);
router.get("/", getUserBudgets);
router.delete("/:id", deleteBudget);

module.exports = router;
