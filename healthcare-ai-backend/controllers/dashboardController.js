const Prescription = require("../models/prescription");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const prescriptions = await Prescription.find({ userId }).sort({ createdAt: -1 });

    const totalPrescriptions = prescriptions.length;

    const medicineCount = {};
    const doctorCount = {};

    prescriptions.forEach((prescription) => {
      if (prescription.structuredData && prescription.structuredData.medicines) {
        prescription.structuredData.medicines.forEach((med) => {
          if (med.name) {
            medicineCount[med.name] = (medicineCount[med.name] || 0) + 1;
          }
        });
      }

      const doctor = prescription.structuredData?.doctor;
      if (doctor) {
        doctorCount[doctor] = (doctorCount[doctor] || 0) + 1;
      }
    });

    const topMedicines = Object.entries(medicineCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topDoctors = Object.entries(doctorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Get recent prescriptions for timeline
    const recentPrescriptions = prescriptions.slice(0, 5).map(p => ({
        id: p._id,
        doctor: p.structuredData?.doctor || 'Unknown',
        date: p.createdAt,
        medicineCount: p.structuredData?.medicines?.length || 0
    }));

    res.json({
      totalPrescriptions,
      topMedicines,
      topDoctors,
      recentPrescriptions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard analytics failed" });
  }
};
