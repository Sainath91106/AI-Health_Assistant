require('dotenv').config();
const pinecone = require('./config/pinecone');
const { generateEmbedding } = require('./services/aiService');

async function testSearch() {
  try {
    const query = "i am suffering with fever which medicine i have to use for that";
    const embedding = await generateEmbedding(query);

    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
    const pineconeResults = await index.query({
      vector: embedding,
      topK: 3,
      includeMetadata: true,
      filter: {
        userId: "69db579f879d848174e3bc5a"
      }
    });
    
    console.log("Matches:", pineconeResults.matches.length);
    console.log("Matches data:", pineconeResults.matches.map(m => m.metadata.userId));
    process.exit(0);
  } catch(e) { console.error(e); process.exit(1); }
}
testSearch();
