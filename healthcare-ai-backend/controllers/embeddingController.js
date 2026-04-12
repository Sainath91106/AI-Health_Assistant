const Embedding = require('../models/embedding');

// Create a new embedding
exports.createEmbedding = async (req, res) => {
  try {
    const embedding = new Embedding(req.body);
    await embedding.save();
    res.status(201).json(embedding);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all embeddings for a prescription
exports.getPrescriptionEmbeddings = async (req, res) => {
  try {
    const embeddings = await Embedding.find({ prescriptionId: req.params.prescriptionId });
    res.json(embeddings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an embedding
exports.deleteEmbedding = async (req, res) => {
  try {
    const embedding = await Embedding.findByIdAndDelete(req.params.id);
    if (!embedding) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
