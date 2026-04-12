const cloudinary = require("../config/cloudinary");
const Prescription = require("../models/prescription");
const {
  extractTextFromImage,
  ocrTextToPrescriptionJSON,
  healthcareChatbot,
} = require("../services/aiService");

// Upload prescription image, extract text, and store structured data
exports.uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileStr = req.file.buffer.toString("base64");
    const uploadResponse = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${fileStr}`,
      { folder: "prescriptions" }
    );

    const imageUrl = uploadResponse.secure_url;
    const extractedText = await extractTextFromImage(imageUrl);
    const structuredData = await ocrTextToPrescriptionJSON(extractedText);

    const prescription = await Prescription.create({
      userId: req.user._id,
      imageUrl,
      extractedText,
      structuredData,
    });

    // Pinecone integration: store embedding after saving prescription
    const pinecone = require("../config/pinecone");
    const { generateEmbedding } = require("../services/aiService");
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
    const textForEmbedding = `\nMedicines: ${structuredData.medicines.map(m => m.name).join(", ")}\nDoctor: ${structuredData.doctor}\nNotes: ${structuredData.notes}\n`;
    const embedding = await generateEmbedding(textForEmbedding);
    await index.upsert({
      records: [
        {
          id: prescription._id.toString(),
          values: embedding,
          metadata: {
            userId: req.user._id.toString(),
            prescriptionId: prescription._id.toString(),
            text: textForEmbedding,
          },
        },
      ]
    });

    res.status(201).json({
      message: "Prescription processed successfully",
      prescription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Processing failed" });
  }
};

// Create a new prescription
exports.createPrescription = async (req, res) => {
  try {
    const prescription = new Prescription({
      ...req.body,
      userId: req.user?._id || req.body.userId,
    });

    await prescription.save();
    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all prescriptions for a user
exports.getUserPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ userId: req.params.userId });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single prescription by ID
exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ error: "Not found" });
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a prescription
exports.updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!prescription) return res.status(404).json({ error: "Not found" });
    res.json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a prescription
exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Context-aware healthcare chatbot endpoint
exports.prescriptionChatbot = async (req, res) => {
  try {
    const { question, prescriptionData, chatHistory } = req.body;

    if (!question || !prescriptionData) {
      return res
        .status(400)
        .json({ message: "Missing question or prescriptionData" });
    }

    const answer = await healthcareChatbot({
      question,
      prescriptionData,
      chatHistory: chatHistory || [],
    });

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Chatbot failed" });
  }
};
