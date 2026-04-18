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

Please provide a comprehensive and structured daily meal plan. Instead of just listing all possible foods at once, categorize the foods strictly by the specific time of day they should be consumed.

Your response MUST include the following sections, with detailed, actionable advice in each:

1.  **Meal-by-Meal Diet Plan**:
    *   **Breakfast**: Suggest specific healthy foods to eat in the morning and explain *why*.
    *   **Mid-Morning Snack**: Suggest light and healthy options.
    *   **Lunch**: Suggest a balanced meal and specific food items.
    *   **Evening Snack**: Suggest healthy alternatives to junk food.
    *   **Dinner**: Suggest a light, nutritious meal and specific food items.
    *   *Note: For each meal, explicitly list the exact foods to take at that respective time rather than an overall list.*

2.  **Foods to Strictly Avoid**:
    *   List specific food items and categories to avoid (e.g., "Sugary Drinks", "Fried Foods").
    *   For each, explain *why* it should be avoided based on their goal/history.

3.  **Healthy Food Habits & Lifestyle**:
    *   **Meal Timing**: Suggest ideal times for each meal to maintain energy and metabolism.
    *   **Hydration**: Specify the recommended daily water intake and suggest other healthy fluids.
    *   **Portion Control**: Give simple, practical tips for managing portion sizes.

4.  **Important Precautions**:
    *   Remind the user that this is a general guide and not a medical prescription.
    *   Clearly state when they should consult their doctor or a registered dietitian.

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
