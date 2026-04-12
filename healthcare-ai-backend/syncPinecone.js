require("dotenv").config();
const mongoose = require("mongoose");
const pinecone = require("./config/pinecone");
const { generateEmbedding } = require("./services/aiService");
const Prescription = require("./models/prescription");

async function sync() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const prescriptions = await Prescription.find({});
    console.log(`Found ${prescriptions.length} prescriptions in MongoDB.`);

    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

    for (const prescription of prescriptions) {
      if (!prescription.structuredData || !prescription.structuredData.medicines) {
        console.log(`Skipping prescription ${prescription._id} (Missing structured data)`);
        continue;
      }
      
      const medicinesStr = prescription.structuredData.medicines.map(m => m.name).join(", ");
      const textForEmbedding = `\nMedicines: ${medicinesStr}\nDoctor: ${prescription.structuredData.doctor}\nNotes: ${prescription.structuredData.notes}\n`;
      
      console.log(`Generating embedding for ID: ${prescription._id}...`);
      const embedding = await generateEmbedding(textForEmbedding);
      
      await index.upsert({
        records: [
          {
            id: prescription._id.toString(),
            values: embedding,
            metadata: {
              userId: prescription.userId.toString(),
              prescriptionId: prescription._id.toString(),
              text: textForEmbedding,
            },
          }
        ]
      });
      console.log(`✅ Successfully synced prescription ${prescription._id} to Pinecone!`);
    }

    console.log("\n🚀 All existing MongoDB prescriptions synced to Pinecone RAG Database!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Sync failed:", err);
    process.exit(1);
  }
}

sync();
