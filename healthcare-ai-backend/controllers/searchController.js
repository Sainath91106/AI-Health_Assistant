const pinecone = require("../config/pinecone");
const { generateEmbedding } = require("../services/aiService");

exports.searchPrescriptions = async (req, res) => {
  try {
    const { query } = req.body;
    const embedding = await generateEmbedding(query);
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
    const results = await index.query({
      vector: embedding,
      topK: 20, // Increase topK to find more potential text matches
      includeMetadata: true,
      filter: {
        userId: req.user._id.toString(),
      },
    });

    // Post-process to boost exact keyword match scores
    const queryLower = query.toLowerCase();
    
    let processedMatches = results.matches.map(match => {
      const textMatch = match.metadata && match.metadata.text 
        ? match.metadata.text.toLowerCase().includes(queryLower) 
        : false;
        
      return {
        ...match,
        // Boost the score significantly if there is a literal text match, cap at 0.99
        score: textMatch ? Math.min(0.99, match.score + 0.5) : match.score,
        exactMatch: textMatch
      };
    });

    // Re-sort matches by the new boosted score
    processedMatches.sort((a, b) => b.score - a.score);

    // Return the top 5 matches after re-ranking
    res.json(processedMatches.slice(0, 5));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Search failed" });
  }
};
