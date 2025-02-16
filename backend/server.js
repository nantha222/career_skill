const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("../backend/routes/authRoute");
const mlRoutes = require("./routes/mlRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ml", mlRoutes);

// Skill Routes
const skillRoutes = require("./routes/skillRoutes");
app.use("/api/skills", skillRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
