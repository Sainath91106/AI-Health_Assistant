const pinecone = require("../config/pinecone");
const { generateEmbedding } = require("../services/aiService");

exports.searchPrescriptions = async (req, res) => {
  try {
    const { query } = req.body;
    const embedding = await generateEmbedding(query);
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
    const results = await index.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
      filter: {
        userId: req.user._id.toString(),
      },
    });
    res.json(results.matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Search failed" });
  }
};
