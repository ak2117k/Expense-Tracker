const express = require("express");
const router = express.Router();
const protectRoute = require("../middlewares/auth.middleware.js");
const {
  getDashboardReport,
  insertMonthlyReport,
  getMonthlyReports,
} = require("../controllers/report.controller.js");

router.use(protectRoute);

router.get("/", getDashboardReport);
router.get("/monthly", protectRoute, getMonthlyReports);
router.post("/monthly/insert", protectRoute, insertMonthlyReport);

module.exports = router;
