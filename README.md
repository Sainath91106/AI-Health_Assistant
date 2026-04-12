<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=40&pause=1000&color=2563EB&center=true&vCenter=true&width=800&lines=Welcome+to+AI+Healthcare+Assistant+🏥;Your+Personal+Smart+Health+Companion;Powered+by+RAG%2C+Gemini+%26+Pinecone" alt="Typing SVG" />
</div>

<p align="center">
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge&logo=react" alt="React"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-success?style=for-the-badge&logo=nodedotjs" alt="Node.js"></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB"></a>
  <a href="https://www.pinecone.io/"><img src="https://img.shields.io/badge/Vector_DB-Pinecone-000000?style=for-the-badge&logo=pinecone" alt="Pinecone"></a>
  <a href="https://deepmind.google/technologies/gemini/"><img src="https://img.shields.io/badge/AI_Engine-Google%20Gemini-orange?style=for-the-badge&logo=google" alt="Gemini"></a>
</p>

---

## 🌟 Overview

The **AI Healthcare Assistant** is a comprehensive, full-stack application designed to help users manage their medical history, understand their prescriptions, and receive personalized health, diet, and wellness insights using cutting-edge AI (Retrieval-Augmented Generation). 

This project operates as a monorepo containing both the React frontend and the Node.js backend.

## ✨ Core Functionalities

<details open>
<summary><b>📄 Smart Prescription Upload & OCR</b></summary>
Upload medical prescriptions securely. The system uses AI vision capabilities to scan the image and automatically extract structured data like Doctor's Name, Medicines, Dosage, and Medical Notes.
</details>

<details open>
<summary><b>🔍 AI-Powered Semantic Search</b></summary>
Powered by Hugging Face embeddings and Pinecone Vector Database, you can search through your medical history using natural language (e.g., "What did I take for my fever last year?").
</details>

<details open>
<summary><b>💬 RAG Chat Assistant</b></summary>
A highly intelligent ChatGPT-like interface that knows your medical history. Ask the assistant to explain your prescriptions, suggest lifestyle changes, or clarify medicine side-effects using the powerful Google Gemini AI model.
</details>

<details open>
<summary><b>📊 Health Insights Dashboard</b></summary>
A beautifully visualized dashboard built with Recharts. It tracks your overall health metrics, top prescribed medicines, doctor visits, and visualizes patterns in your medical history over time.
</details>

<details open>
<summary><b>🚨 Smart Alert System</b></summary>
An automated background evaluator that analyzes your prescription history to detect concerning patterns, such as frequent antibiotic usage, excessive painkiller dependencies, or conflicting records, presenting actionable health alerts.
</details>

<details open>
<summary><b>🥗 Personalized Diet Plan Generator</b></summary>
Uses your medical history as contextual data to generate highly customized, safe, and structured diet plans tailored exactly to your health goals and existing conditions.
</details>

<br>

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTk4Y2MwOGM1ZjBiMGFkOTA2MjBkNjJmMTE4NGI1M2VhM2RkNDhmNSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3o7aD2saalEvTehEXe/giphy.gif" width="400" style="border-radius: 10px;" alt="Healthcare Animation">
</div>

---

## 🛠️ Tech Stack

### Frontend 💻
- **Framework**: React.js (via Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts/Visualization**: Recharts
- **HTTP Client**: Axios

### Backend ⚙️
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (Mongoose)
- **Image Storage**: Cloudinary
- **Authentication**: JWT & bcrypt

### AI & Machine Learning 🧠
- **LLM / Vision**: Google Gemini (gemini-2.5-flash)
- **Embeddings**: Hugging Face (`sentence-transformers/all-MiniLM-L6-v2`)
- **Vector Database**: Pinecone DB

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Sainath91106/AI-Health_Assistant.git
cd AIHealthcare
```

### 2. Backend Setup
```bash
cd healthcare-ai-backend
npm install
```
Create a `.env` file in the `healthcare-ai-backend` directory with the following keys:
```env
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=healthcare-rag

HF_API_KEY=your_huggingface_api_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd "AIHealthcare Frontend"
npm install
```
Start the frontend development server:
```bash
npm run dev
```

---

<div align="center">
Made with ❤️ by <a href="https://github.com/Sainath91106">Sainath</a>
</div>