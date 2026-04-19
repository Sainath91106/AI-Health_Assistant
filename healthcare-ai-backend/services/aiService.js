const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const { HfInference } = require("@huggingface/inference");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const hf = new HfInference(process.env.HF_API_KEY);

const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL
].filter(Boolean);

// Generate embedding for Pinecone
exports.generateEmbedding = async (text) => {
  try {
    const result = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text,
    });
    
    // The HF Inference SDK returns a 1D array for single inputs, but can return 2D arrays if structured differently
    // Just ensure we return the direct array of numbers
    if (Array.isArray(result) && Array.isArray(result[0])) {
        return result[0];
    }
    return result;
  } catch (error) {
    console.error("Embedding Error:", error.message || error);
    throw error;
  }
};

let cachedWorkingModel = null;

const isModelNotFoundError = (error) => {
  const message = String(error?.message || "").toLowerCase();
  const status = Number(
    error?.status || error?.response?.status || error?.response?.data?.error?.code
  );

  return (
    status === 404 ||
    status === 429 || // Also failover if rate limited
    message.includes("is not found") ||
    message.includes("model not found") ||
    message.includes("quota")
  );
};

const getErrorMessage = (error) => {
  if (error?.response?.data) {
    try {
      return JSON.stringify(error.response.data);
    } catch (_) {
      return String(error.message || error);
    }
  }
  return String(error?.message || error);
};


// Retry wrapper for Gemini API calls
async function retryGemini(fn, retries = 2, delayMs = 1500) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      const status = Number(err?.status || err?.response?.status || err?.response?.data?.error?.code);
      if (status === 429 || status === 404) throw err; // Don't sleep-retry on definitive errors like 429 or 404
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
}

const generateContentWithFallback = async (request) => {
  const candidates = cachedWorkingModel
    ? [cachedWorkingModel, ...MODEL_CANDIDATES.filter((m) => m !== cachedWorkingModel)]
    : MODEL_CANDIDATES;

  let lastError;

  for (const modelName of candidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await retryGemini(() => model.generateContent(request));

      if (cachedWorkingModel !== modelName) {
        cachedWorkingModel = modelName;
        console.log(`Using Gemini model: ${modelName}`);
      }

      return result;
    } catch (error) {
      lastError = error;
      if (isModelNotFoundError(error)) {
        // Fast failover directly to the next model without burning time
        continue;
      }
      throw error;
    }
  }

  throw lastError || new Error("No compatible Gemini model found");
};

exports.healthcareChatbot = async ({ question, prescriptionData, chatHistory = [] }) => {
  try {
    const prompt = `
You are an advanced AI Personal Healthcare Assistant designed to behave like a knowledgeable, compassionate medical support assistant.

Your role is to help users understand their prescriptions, medicines, treatment plans, and general health-related concerns in a professional and doctor-like manner while remaining safe and responsible.

CORE RESPONSIBILITIES:
- Explain prescriptions in clear, easy-to-understand language.
- Describe medicine purposes, dosage, timing, and duration.
- Summarize prescription details for the user.
- Provide general wellness and recovery recommendations based on prescription context.
- Suggest dietary precautions and lifestyle recommendations when relevant.
- Highlight repeated medicines or unusual dosage patterns.
- Warn users politely if medicine usage appears frequent or concerning.
- Answer follow-up questions contextually using prescription history and chat memory.

BEHAVIOR GUIDELINES:
- Respond like a helpful doctor’s assistant: professional, calm, empathetic, and informative.
- Be conversational and supportive, not robotic.
- Use dashes or bullet points for medicine/instruction lists, but NEVER use bolding or asterisks (like **word**).
- Explain medical terms simply when possible.
- Encourage healthy practices and adherence to prescribed instructions.
- If the user asks a general health question unrelated to their prescription, still give helpful general advice and possible causes, then recommend consulting a doctor.

STRICT SAFETY RULES:
1. NEVER provide medical diagnosis.
2. You may suggest common over-the-counter (OTC) medicines for symptom relief, but clearly state they are OTC and not official prescriptions.
3. NEVER recommend changing dosage without doctor consultation.
4. NEVER claim certainty when data is incomplete.
5. If asked for diagnosis/emergency help, advise immediate professional consultation.
6. NEVER hallucinate prescription or medical details not present in the provided data.
7. Clearly state when information is unavailable.

WHEN APPROPRIATE, ALSO PROVIDE:
- General recovery advice
- Food/diet suggestions
- Medication timing reminders
- Hydration/rest recommendations
- Warnings about missed dosage concerns (general only)

AVAILABLE USER DATA:
Prescription Data:
${JSON.stringify(prescriptionData)}

Chat History:
${chatHistory
  .map((msg, i) => `Q${i + 1}: ${msg.question}\nA${i + 1}: ${msg.answer}`)
  .join("\n")}

User Question:
${question}
`;

    const result = await generateContentWithFallback(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Chatbot failed:", getErrorMessage(error));
    throw new Error("Failed to generate chatbot response");
  }
};

exports.chatWithContext = async (message, prescriptions = [], chatHistory = []) => {
  try {
    const prompt = `
You are a helpful and empathetic AI healthcare assistant.
- Use prescription context and prior conversation when relevant.
- Give concise, safe and practical guidance.
- While you cannot provide an official medical diagnosis, you MUST provide general, helpful information about possible common causes, general advice, home remedies, and specifically SUGGEST common over-the-counter (OTC) medicines that provide relief for the symptoms mentioned.
- ONLY answer questions regarding personal health symptoms, medical conditions, medications, prescriptions, diet, wellness, and self-care.
- IMPORTANT RESTRICTION: You MUST politely REFUSE to answer questions about the healthcare industry, medical technologies, celebrities, news, trivia, or any non-personal-medical topics. If the user asks about these, state that you are exclusively a personal medical assistant and cannot answer.
- If the query is a personal health question and not related to the user's specific prescription, still answer it in a helpful, informative way, then politely remind them to consult a doctor.
- Always advise the user to consult a doctor for a proper evaluation.
- IMPORTANT FORMATTING: Do NOT use markdown bolding (such as asterisks like **word**). Return clean, plain text formatting. Use dashes or bullet points for lists, without bolding the items.

Prescription Context:
${JSON.stringify(prescriptions)}

Chat History:
${chatHistory
  .map((m, i) => `${i + 1}. ${m.role || "user"}: ${m.content || ""}`)
  .join("\n")}

User Message:
${message}
`;

    const result = await generateContentWithFallback(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Context chat failed:", getErrorMessage(error));
    throw new Error("Failed to generate context-aware response");
  }
};

exports.extractTextFromImage = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    let mimeType = "image/jpeg";
    if (imageUrl.endsWith(".png")) mimeType = "image/png";
    else if (imageUrl.endsWith(".webp")) mimeType = "image/webp";

    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const prompt =
      "Extract all readable text from this medical prescription image. Return only the text.";

    const result = await generateContentWithFallback({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    return result.response.text().trim();
  } catch (error) {
    console.error("OCR extraction failed:", getErrorMessage(error));
    throw new Error("Failed to extract text from image");
  }
};

exports.ocrTextToPrescriptionJSON = async (ocrText) => {
  try {
    const prompt = `
Convert the following text into JSON with this format:
{
  "medicines": [
    {
      "name": "",
      "dosage": "",
      "timing": "",
      "duration": ""
    }
  ],
  "doctor": "",
  "hospital": "",
  "date": "",
  "notes": ""
}
Only return valid JSON. No explanation. Handle messy OCR text properly.

Input:
${ocrText}
`;

    const result = await generateContentWithFallback(prompt);
    const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in Gemini response");

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("JSON extraction failed:", getErrorMessage(error));
    throw new Error("Failed to convert OCR text to JSON");
  }
};
