const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  imageUrl: String,
  extractedText: String, // raw OCR text
  structuredData: {
    medicines: [
      {
        name: String,
        dosage: String,
        timing: String,
        duration: String,
      }
    ],
    doctor: String,
    hospital: String,
    date: String,
    notes: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
