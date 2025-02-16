import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");
  const [description, setDescription] = useState("");

  // Fetch All Skills
  useEffect(() => {
    axios.get("http://localhost:5000/api/skills")
      .then((res) => setSkills(res.data))
      .catch((err) => console.error("Error fetching skills:", err));
  }, []);

  // Add New Skill
  const handleAddSkill = async () => {
    if (!skillName || !description) return alert("Please fill all fields!");
    try {
      const res = await axios.post("http://localhost:5000/api/skills", { skillName, description });
      setSkills([...skills, res.data]); // Update state
      setSkillName("");
      setDescription("");
    } catch (err) {
      console.error("Error adding skill:", err);
    }
  };

  // Delete Skill
  const handleDeleteSkill = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/skills/${id}`);
      setSkills(skills.filter(skill => skill._id !== id));
    } catch (err) {
      console.error("Error deleting skill:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold text-center text-gray-700 dark:text-white">Admin Dashboard</h1>

      {/* Add New Skill Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-4">Add New Skill</h2>
        <input
          type="text"
          placeholder="Skill Name"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <textarea
          placeholder="Skill Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        ></textarea>
        <button
          onClick={handleAddSkill}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg"
        >
          Add Skill
        </button>
      </div>

      {/* Skills List */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-700 dark:text-white text-center">Uploaded Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {skills.map((skill) => (
            <div key={skill._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{skill.skillName}</h3>
              <p className="text-gray-600 dark:text-gray-300">{skill.description}</p>
              <button
                onClick={() => handleDeleteSkill(skill._id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
