require('dotenv').config();
const mongoose = require('mongoose');
const Prescription = require('./models/prescription');

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const userId = '69db579f879d848174e3bc5a'; // Venkat's ID
    
    const prescriptions = await Prescription.find({ userId });
    console.log(`✅ Found ${prescriptions.length} prescriptions for diet context`);
    
    // Show what would be sent to Gemini
    const context = prescriptions.slice(0, 5).map(p => {
      const medicines = p.structuredData?.medicines
        ?.map(m => `${m.name}${m.dosage ? ` (${m.dosage})` : ''}`)
        .join(", ") || "Not specified";
      
      return `
Doctor: ${p.structuredData?.doctor || "Unknown"}
Date: ${new Date(p.createdAt).toLocaleDateString()}
Medicines: ${medicines}
Notes: ${p.structuredData?.notes || "No notes"}
      `.trim();
    }).join("\n---\n");
    
    console.log("\n📋 Medical Context for Diet Plan:\n");
    console.log(context);
    console.log("\n✅ Backend API ready! Frontend can now call POST /api/diet/generate");
    
    process.exit(0);
  } catch(e) { console.error(e); process.exit(1); }
}
test();
