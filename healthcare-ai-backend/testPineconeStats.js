require('dotenv').config();
const pinecone = require('./config/pinecone');
async function run() {
  const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
  const stats = await index.describeIndexStats();
  console.log(stats);
}
run();
