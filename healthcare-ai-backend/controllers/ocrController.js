const { processPrescriptionImage } = require("../services/aiService");

exports.testOCRPipeline = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded. Use multipart/form-data with 'file'." });
    }

    const { rawText, cleanedText, structuredData } = await processPrescriptionImage(req.file.buffer);

    return res.status(200).json({
      rawText,
      cleanedText,
      structuredData,
    });
  } catch (error) {
    console.error("Test OCR endpoint failed:", error?.message || error);
    return res.status(500).json({
      message: "OCR test pipeline failed",
      rawText: "",
      cleanedText: "",
      structuredData: {
        doctor: "",
        hospital: "",
        date: "",
        medicines: [],
        notes: "Pipeline failed before completion.",
      },
    });
  }
};
