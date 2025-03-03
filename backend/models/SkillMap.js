const mongoose = require("mongoose");

const skillMapSchema = new mongoose.Schema({
  skillName: { type: String, required: true },
  learningPath: [
      {
          topic: { type: String, required: true },
          order: { type: Number, required: true }
      }
  ], // ✅ Now it expects an array of objects
  courseLinks: [{ type: String }],
  youtubeLinks: [{ type: String }]
});

module.exports = mongoose.model("SkillMap", skillMapSchema);
