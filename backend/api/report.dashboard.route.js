const express = require("express");
const router = express.Router();
const protectRoute = require("../middlewares/auth.middleware.js");
const { getDashboardReport } = require("../controllers/report.controller.js");

router.use(protectRoute);

router.get("/", getDashboardReport);

module.exports = router;
