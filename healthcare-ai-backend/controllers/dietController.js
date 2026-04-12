const Diet = require('../models/diet');
const Prescription = require('../models/prescription');
const { chatWithContext } = require('../services/aiService');

// Generate personalized diet plan using AI
exports.generateDietPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { goal } = req.body;

    if (!goal || goal.trim().length === 0) {
      return res.status(400).json({ message: "Please provide a health goal or preference" });
    }

    const prescriptions = await Prescription.find({ userId }).sort({ createdAt: -1 });

    if (prescriptions.length === 0) {
      return res.status(400).json({ 
        message: "No prescription history found. Please upload prescriptions first for personalized recommendations." 
      });
    }

    // Build medical context from prescriptions
    const medicalContext = prescriptions
      .slice(0, 5) // Use last 5 prescriptions for context
      .map((p) => {
        const medicines = p.structuredData?.medicines
          ?.map(m => `${m.name}${m.dosage ? ` (${m.dosage})` : ''}`)
          .join(", ") || "Not specified";
        
        return `
Doctor: ${p.structuredData?.doctor || "Unknown"}
Date: ${new Date(p.createdAt).toLocaleDateString()}
Medicines: ${medicines}
Notes: ${p.structuredData?.notes || "No notes"}
        `.trim();
      })
      .join("\n---\n");

    const prompt = `
You are a professional AI healthcare nutrition and wellness assistant.

Based on the user's medical prescription history below, generate a personalized diet and lifestyle recommendation.

IMPORTANT RULES:
- Do NOT diagnose diseases or conditions
- Do NOT prescribe medicines or treatments
- Only provide general dietary and lifestyle suggestions
- Give safe, evidence-based recommendations
- Be practical and actionable

User's Health Goal:
${goal}

Recent Medical History (from prescriptions):
${medicalContext}

Please provide a comprehensive and structured diet plan. The plan should be easy to follow, practical, and tailored to the user's health goal and medical history.

Your response MUST include the following sections, with detailed, actionable advice in each:

1.  **Foods to Eat**:
    *   List specific, healthy, and readily available food items (e.g., "Brown Rice," "Spinach," "Salmon," "Almonds").
    *   For each food, briefly explain *why* it's beneficial for the user's context (e.g., "rich in fiber," "high in omega-3 fatty acids").
    *   Group foods into categories like Fruits, Vegetables, Proteins, Grains, and Healthy Fats.

2.  **Foods to Avoid**:
    *   List specific food items and categories to limit or avoid (e.g., "Sugary Drinks," "Processed Snacks," "Fried Foods," "Excessive Red Meat").
    *   For each, explain *why* it should be avoided (e.g., "high in empty calories," "can increase inflammation").

3.  **Healthy Food Habits & Lifestyle**:
    *   **Meal Plan Example**: Provide a sample one-day meal plan (Breakfast, Lunch, Dinner, Snacks) using the recommended foods.
    *   **Meal Timing**: Suggest ideal times for meals to maintain energy and metabolism.
    *   **Hydration**: Specify the recommended daily water intake and suggest other healthy fluids.
    *   **Portion Control**: Give simple, practical tips for managing portion sizes.
    *   **Lifestyle Integration**: Include advice on sleep, gentle exercise, and stress management that complements the diet.

4.  **Important Precautions**:
    *   Remind the user that this is a general guide and not a medical prescription.
    *   Clearly state when they should consult their doctor or a registered dietitian, especially before making significant dietary changes.

Format the entire response in clear, well-structured Markdown with headings and bullet points.
`;

    const dietPlan = await chatWithContext(prompt);

    // Optionally save to database
    const savedDiet = new Diet({
      userId,
      goal,
      plan: dietPlan,
      prescriptionCount: prescriptions.length,
    });
    await savedDiet.save();

    res.json({ 
      dietPlan,
      goal,
      prescriptionCount: prescriptions.length,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error("Diet plan generation failed:", error);
    res.status(500).json({ message: "Failed to generate diet plan. Please try again." });
  }
};

// Create a new diet plan
exports.createDiet = async (req, res) => {
  try {
    const diet = new Diet(req.body);
    await diet.save();
    res.status(201).json(diet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all diet plans for a user
exports.getUserDiets = async (req, res) => {
  try {
    const diets = await Diet.find({ userId: req.params.userId });
    res.json(diets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a diet plan
exports.deleteDiet = async (req, res) => {
  try {
    const diet = await Diet.findByIdAndDelete(req.params.id);
    if (!diet) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
