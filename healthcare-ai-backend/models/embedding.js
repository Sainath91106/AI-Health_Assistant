const mongoose = require("mongoose");

const embeddingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription",
  },
  textChunk: String,
  vectorId: String // ID from Pinecone
});

module.exports = mongoose.model("Embedding", embeddingSchema);
