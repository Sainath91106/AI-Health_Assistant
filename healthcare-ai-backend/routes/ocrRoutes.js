const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { testOCRPipeline } = require("../controllers/ocrController");

const router = express.Router();

router.post("/test-ocr", upload.single("file"), testOCRPipeline);

module.exports = router;
