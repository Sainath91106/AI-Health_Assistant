require('dotenv').config();
const pinecone = require('./config/pinecone');
const { generateEmbedding } = require('./services/aiService');

async function testSearch() {
  try {
    const query = "painkillers or headache medicine";
    console.log(`1. Generating embedding for: "${query}"...`);
    const embedding = await generateEmbedding(query);
    console.log(`   Success! Vector length: ${embedding.length}`);

    console.log('2. Querying Pinecone index...');
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
    
    const results = await index.query({
      vector: embedding,
      topK: 3,
      includeMetadata: true
    });
    
    console.log('\n--- SEARCH RESULTS ---');
    console.log(`Found ${results.matches.length} matching prescriptions in the database.`);
    
    results.matches.forEach((match, i) => {
      console.log(`\nResult ${i + 1} (Score: ${match.score.toFixed(3)}):`);
      console.log(`- Extracted Text: ${match.metadata.text.substring(0, 100)}...`);
    });
    console.log('\n✅ Search workflow is fully operational!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Search test failed:', err);
    process.exit(1);
  }
}

testSearch();
