const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
const authRoutes = require("./routes/authRoute");
const mlRoutes = require("./routes/mlRoutes");
const skillRoutes = require("./routes/skillRoutes");
const skillMapRoutes = require("./routes/skillMapRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/skill-maps", skillMapRoutes);

// ✅ Remove the unnecessary duplicate GET /api/skill-maps/:id

// Error Handling Middleware (Handles 404 errors)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
