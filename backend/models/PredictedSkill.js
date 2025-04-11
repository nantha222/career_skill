const mongoose = require("mongoose");

const predictedSkillSchema = new mongoose.Schema({
  userId: String,
  skill: String,
});

const PredictedSkill = mongoose.model("PredictedSkill", predictedSkillSchema);

module.exports = PredictedSkill;
  