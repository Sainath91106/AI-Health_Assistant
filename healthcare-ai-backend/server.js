const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();



app.use(cors());
app.use(express.json()); // <-- JSON body parser before auth/chat

app.get("/", (req, res) => {
  res.send("API Running...");
});




// JSON APIs (need body parser)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

// File upload and other routes
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));

app.use("/api/embeddings", require("./routes/embeddingRoutes"));
app.use("/api/diets", require("./routes/dietRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/diet", require("./routes/dietRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/alerts", require("./routes/alertRoutes"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));