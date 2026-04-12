
const Chat = require('../models/chat');
const Prescription = require("../models/prescription");
const { chatWithContext, generateEmbedding } = require("../services/aiService");
const pinecone = require("../config/pinecone");

// Send Message (context-aware chat with RAG)
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    // 1️⃣ RAG Retrieval: Generate embedding for user message
    const embedding = await generateEmbedding(message);
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
    
    // 2️⃣ Search Pinecone for the 3 most relevant prescriptions
    const pineconeResults = await index.query({
      vector: embedding,
      topK: 3,
      includeMetadata: true,
      filter: {
        userId: userId.toString(),
      },
    });

    // 3️⃣ Fetch the matching prescriptions from MongoDB
    const matchedPrescriptionIds = pineconeResults.matches.map(match => match.id);
    const relevantPrescriptions = await Prescription.find({ 
      _id: { $in: matchedPrescriptionIds },
      userId 
    });

    // 4️⃣ Get chat history
    let chat = await Chat.findOne({ userId });
    if (!chat) {
      chat = await Chat.create({ userId, messages: [] });
    }

    // 5️⃣ Call AI using only retrieved relevant context
    const aiResponse = await chatWithContext(
      message,
      relevantPrescriptions,
      chat.messages
    );

    // 6️⃣ Save messages
    chat.messages.push(
      { role: "user", content: message },
      { role: "assistant", content: aiResponse }
    );
    await chat.save();

    res.json({
      reply: aiResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Chat failed" });
  }
};

// Create or update chat for a user
exports.addMessage = async (req, res) => {
  try {
    let chat = await Chat.findOne({ userId: req.body.userId });
    if (!chat) {
      chat = new Chat({ userId: req.body.userId, messages: [req.body.message] });
    } else {
      chat.messages.push(req.body.message);
    }
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get chat history for a user
exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.params.userId });
    if (!chat) return res.status(404).json({ error: 'Not found' });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
