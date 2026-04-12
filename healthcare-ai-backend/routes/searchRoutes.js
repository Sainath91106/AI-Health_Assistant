const express = require("express");
const router = express.Router();

const { searchPrescriptions } = require("../controllers/searchController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, searchPrescriptions);

module.exports = router;
