const express = require("express");
const SkillMap = require("../models/SkillMap"); // Ensure this is correctly imported
const router = express.Router();

// ✅ Get all skill maps
router.get("/", async (req, res) => {
    try {
        const skills = await SkillMap.find();
        res.json(skills);
    } catch (err) {
        res.status(500).json({ message: "Error fetching skills" });
    }
});

// ✅ Get a single skill map by ID
router.get("/:id", async (req, res) => {
    try {
        const skill = await SkillMap.findById(req.params.id);
        if (!skill) return res.status(404).json({ message: "Skill not found" });
        res.json(skill);
    } catch (err) {
        res.status(500).json({ message: "Error fetching skill details" });
    }
});

// ✅ POST route: Create a new skill map
router.post("/", async (req, res) => {
    try {
        const { skillName, learningPath, courseLinks, youtubeLinks } = req.body;

        if (!skillName || !learningPath) {
            return res.status(400).json({ message: "Skill Name and Topics are required" });
        }

        const newSkillMap = new SkillMap({
            skillName,
            learningPath,
            courseLinks,
            youtubeLinks,
        });

        await newSkillMap.save();
        res.status(201).json(newSkillMap);
    } catch (err) {
        res.status(500).json({ message: "Error saving skill map", error: err.message });
    }
});


module.exports = router;
