require('dotenv').config();
const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HF_API_KEY);

async function run() {
  try {
    const result = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: 'That is a happy person',
    });
    console.log("Vector length:", result.length);
    console.log("First values:", result.slice(0, 5));
  } catch (err) {
    console.error(err.message || err);
  }
}
run();
