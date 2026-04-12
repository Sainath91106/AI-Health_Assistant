require('dotenv').config();
const mongoose = require('mongoose');
const pinecone = require('./config/pinecone');
const Prescription = require('./models/prescription');
const Chat = require('./models/chat');
const { generateEmbedding, chatWithContext } = require('./services/aiService');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const userId = '69db579f879d848174e3bc5a'; // Venkat's ID
  const message = "i am suffering with fever which medicine i have to use for that";
  
  try {
    const embedding = await generateEmbedding(message);
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
    
    const pineconeResults = await index.query({
      vector: embedding,
      topK: 3,
      includeMetadata: true,
      filter: { userId }
    });

    const matchedPrescriptionIds = pineconeResults.matches.map(m => m.id);
    const relevantPrescriptions = await Prescription.find({ 
      _id: { $in: matchedPrescriptionIds },
      userId 
    });
    
    console.log("RAG Found Prescriptions:", relevantPrescriptions.length);
    
    let chat = await Chat.findOne({ userId });
    if (!chat) chat = { messages: [] };

    console.log("Calling Gemini...");
    const aiResponse = await chatWithContext(
      message,
      relevantPrescriptions,
      chat.messages
    );
    
    console.log("AI Response:", aiResponse);
    process.exit(0);
  } catch(e) {
    console.error("Test failed:", e);
    process.exit(1);
  }
}
test();
