require('dotenv').config();
const pinecone = require('./config/pinecone');
const { generateEmbedding } = require('./services/aiService');
const Prescription = require('./models/prescription');
const mongoose = require('mongoose');

async function testSearch() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // First, let's see ALL prescriptions in MongoDB to ensure they exist.
    const all = await Prescription.find({});
    console.log("Total DB prescriptions:", all.length);

    const query = "i am suffering with fever which medicine i have to use for that";
    const embedding = await generateEmbedding(query);

    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
    const pineconeResults = await index.query({
      vector: embedding,
      topK: 3,
      includeMetadata: true
    });
    
    console.log("Pinecone matches count:", pineconeResults.matches.length);
    console.log("Pinecone matches IDs:", pineconeResults.matches.map(m => m.id));

    process.exit(0);
  } catch (err) {
    console.error('❌ Search test failed:', err);
    process.exit(1);
  }
}

testSearch();
