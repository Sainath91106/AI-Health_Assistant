const Prescription = require("../models/prescription");

exports.getSmartAlerts = async (req, res) => {
  try {
    const userId = req.user._id;

    const prescriptions = await Prescription.find({ userId });

    const alerts = [];
    const medicineCount = {};
    const medicineDetails = {};

    const antibiotics = [
      "Augmentin",
      "Azithromycin",
      "Cefixime",
      "Amoxicillin",
      "Ciprofloxacin",
      "Levofloxacin",
      "Doxycycline",
      "Erythromycin",
    ];

    // Analyze all prescriptions
    prescriptions.forEach((prescription) => {
      if (prescription.structuredData && prescription.structuredData.medicines) {
        prescription.structuredData.medicines.forEach((med) => {
          if (med.name) {
            const name = med.name.trim();
            const lowerName = name.toLowerCase();

            medicineCount[lowerName] = (medicineCount[lowerName] || 0) + 1;

            // Track dosage details for alerts
            if (!medicineDetails[lowerName]) {
              medicineDetails[lowerName] = {
                name,
                dosages: [],
                lastPrescribed: new Date(prescription.createdAt),
              };
            }

            medicineDetails[lowerName].dosages.push(med.dosage || "N/A");
            medicineDetails[lowerName].lastPrescribed = new Date(
              prescription.createdAt
            );
          }
        });
      }
    });

    // Rule 1: Repeated Medicine Alert (3+ times)
    for (const [medicine, count] of Object.entries(medicineCount)) {
      if (count >= 3) {
        const details = medicineDetails[medicine];
        alerts.push({
          type: "Repeated Medicine",
          severity: count >= 5 ? "critical" : "warning",
          message: `${details.name} has been prescribed ${count} times. Please consult your doctor about this pattern.`,
          medicine: details.name,
          count,
        });
      }
    }

    // Rule 2: Frequent Antibiotic Alert
    for (const [medicine, count] of Object.entries(medicineCount)) {
      const isAntibiotic = antibiotics.some((antibiotic) =>
        medicine.includes(antibiotic.toLowerCase())
      );

      if (isAntibiotic && count >= 2) {
        const details = medicineDetails[medicine];
        alerts.push({
          type: "Frequent Antibiotic Usage",
          severity: count >= 4 ? "critical" : "warning",
          message: `Antibiotic "${details.name}" has been prescribed ${count} times. Consider consulting about antibiotic resistance.`,
          medicine: details.name,
          count,
        });
      }
    }

    // Rule 3: High Prescription Frequency Alert
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPrescriptions = prescriptions.filter(
      (p) => new Date(p.createdAt) > thirtyDaysAgo
    );

    if (recentPrescriptions.length >= 10) {
      alerts.push({
        type: "High Prescription Frequency",
        severity: "critical",
        message: `You have ${recentPrescriptions.length} prescriptions in the last 30 days. Consider scheduling a comprehensive medical review.`,
        count: recentPrescriptions.length,
      });
    } else if (recentPrescriptions.length >= 5) {
      alerts.push({
        type: "Elevated Prescription Activity",
        severity: "warning",
        message: `${recentPrescriptions.length} prescriptions uploaded in the last 30 days. Monitor your health closely.`,
        count: recentPrescriptions.length,
      });
    }

    // Rule 4: Duplicate Prescription Alert
    const prescriptionHashes = {};
    prescriptions.forEach((p) => {
      const hash = JSON.stringify(
        p.structuredData?.medicines?.map((m) => m.name).sort() || []
      );
      if (!prescriptionHashes[hash]) {
        prescriptionHashes[hash] = 0;
      }
      prescriptionHashes[hash]++;
    });

    for (const [hash, count] of Object.entries(prescriptionHashes)) {
      if (count >= 2) {
        const medicines = JSON.parse(hash);
        alerts.push({
          type: "Duplicate Prescription Pattern",
          severity: "info",
          message: `Same medicine combination (${medicines.join(
            ", "
          )}) appears ${count} times. Verify if these are separate prescriptions or duplicates.`,
          count,
        });
      }
    }

    // Sort by severity (critical > warning > info)
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    alerts.sort(
      (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
    );

    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate alerts" });
  }
};
