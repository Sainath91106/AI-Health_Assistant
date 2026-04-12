const express = require("express");
const router = express.Router();

const { getSmartAlerts } = require("../controllers/alertController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getSmartAlerts);

module.exports = router;
