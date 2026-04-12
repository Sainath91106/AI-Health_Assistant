require('dotenv').config();
const mongoose = require('mongoose');
const Prescription = require('./models/prescription');
const User = require('./models/user');

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const userId = '69db579f879d848174e3bc5a'; // Venkat's ID
    
    const prescriptions = await Prescription.find({ userId });
    console.log(`✅ Found ${prescriptions.length} prescriptions`);
    
    // Manually run the alert logic
    const medicineCount = {};
    const antibiotics = ["Augmentin", "Azithromycin", "Cefixime", "Amoxicillin"];
    
    prescriptions.forEach((p) => {
      if (p.structuredData?.medicines) {
        p.structuredData.medicines.forEach((med) => {
          const name = med.name?.toLowerCase();
          if (name) medicineCount[name] = (medicineCount[name] || 0) + 1;
        });
      }
    });
    
    console.log("Medicine counts:", medicineCount);
    
    // Check for alerts
    const alerts = [];
    for (const [med, count] of Object.entries(medicineCount)) {
      if (count >= 3) alerts.push(`⚠️  ${med} prescribed ${count} times`);
    }
    
    console.log("Alerts:", alerts.length > 0 ? alerts : "None");
    process.exit(0);
  } catch(e) { console.error(e); process.exit(1); }
}
test();
