import { useState, useEffect } from "react";

const AdminSkillMapPage = () => {
  const [skillMaps, setSkillMaps] = useState([]);
  const [formData, setFormData] = useState({
    skillName: "",
    learningPath: [{ topic: "", subtopics: [{ name: "", resources: [] }], order: 1 }],
    courseLinks: [""],
    youtubeLinks: [""],
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSkillMaps();
  }, []);

  const fetchSkillMaps = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/skill-maps");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setSkillMaps(data);
    } catch (error) {
      console.error("Error fetching skill maps", error);
    }
  };

  const handleInputChange = (e, field, index = null, subIndex = null) => {
    const { name, value } = e.target;
    let updatedField = [...formData[field]];

    if (subIndex !== null) {
      updatedField[index].subtopics[subIndex].name = value;
    } else if (index !== null) {
      updatedField[index][name] = value;
    } else {
      setFormData({ ...formData, [name]: value });
      return;
    }
    setFormData({ ...formData, [field]: updatedField });
  };

  const addTopic = () => {
    setFormData({
      ...formData,
      learningPath: [...formData.learningPath, { topic: "", subtopics: [{ name: "", resources: [] }], order: formData.learningPath.length + 1 }]
    });
  };

  const removeTopic = (index) => {
    let updatedPath = [...formData.learningPath];
    updatedPath.splice(index, 1);
    setFormData({ ...formData, learningPath: updatedPath });
  };

  const addSubtopic = (index) => {
    let updatedPath = [...formData.learningPath];
    updatedPath[index].subtopics.push({ name: "", resources: [] });
    setFormData({ ...formData, learningPath: updatedPath });
  };

  const removeSubtopic = (index, subIndex) => {
    let updatedPath = [...formData.learningPath];
    updatedPath[index].subtopics.splice(subIndex, 1);
    setFormData({ ...formData, learningPath: updatedPath });
  };

  const addResource = (index, subIndex) => {
    let updatedPath = [...formData.learningPath];
    updatedPath[index].subtopics[subIndex].resources.push("");
    setFormData({ ...formData, learningPath: updatedPath });
  };

  const handleResourceChange = (e, index, subIndex, resIndex) => {
    let updatedPath = [...formData.learningPath];
    updatedPath[index].subtopics[subIndex].resources[resIndex] = e.target.value;
    setFormData({ ...formData, learningPath: updatedPath });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `http://localhost:5000/api/skill-maps/${editingId}`
        : "http://localhost:5000/api/skill-maps";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      fetchSkillMaps();
      setFormData({ skillName: "", learningPath: [{ topic: "", subtopics: [{ name: "", resources: [] }], order: 1 }], courseLinks: [""], youtubeLinks: [""] });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving skill map", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Skill Map Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">{editingId ? "Edit Skill Map" : "Create New Skill Map"}</h2>

        {/* Skill Name */}
        <input
          type="text"
          name="skillName"
          value={formData.skillName}
          onChange={(e) => handleInputChange(e, "skillName")}
          placeholder="Skill Name"
          required
          className="w-full p-2 border rounded-md mb-3"
        />

        {/* Learning Path */}
        {formData.learningPath.map((step, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md bg-gray-50">
            <h3 className="text-md font-semibold">Topic {index + 1}</h3>
            <input
              type="text"
              name="topic"
              value={step.topic}
              onChange={(e) => handleInputChange(e, "learningPath", index)}
              placeholder="Topic Name"
              className="w-full p-2 border rounded-md mb-2"
            />

            {/* Subtopics */}
            {step.subtopics.map((sub, subIndex) => (
              <div key={subIndex} className="ml-4 p-3 border rounded-md bg-white">
                <input
                  type="text"
                  placeholder="Subtopic Name"
                  value={sub.name}
                  onChange={(e) => handleInputChange(e, "learningPath", index, subIndex)}
                  className="w-full p-2 border rounded-md"
                />
                {/* Resources */}
                {sub.resources.map((res, resIndex) => (
                  <input
                    key={resIndex}
                    type="url"
                    placeholder="Resource URL"
                    value={res}
                    onChange={(e) => handleResourceChange(e, index, subIndex, resIndex)}
                    className="w-full p-2 border rounded-md mt-2"
                  />
                ))}
                <button type="button" onClick={() => addResource(index, subIndex)} className="text-blue-500 mt-2">
                  + Add Resource
                </button>
                <button type="button" onClick={() => removeSubtopic(index, subIndex)} className="text-red-500 mt-2 ml-2">
                  ❌ Remove Subtopic
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addSubtopic(index)} className="text-blue-500 mt-2">
              + Add Subtopic
            </button>
            <button type="button" onClick={() => removeTopic(index)} className="text-red-500 mt-2 ml-2">
              ❌ Remove Topic
            </button>
          </div>
        ))}
        <button type="button" onClick={addTopic} className="bg-blue-500 text-white p-2 rounded-md mb-3">
          + Add Topic
        </button>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-md">
          {editingId ? "Update Skill Map" : "Create Skill Map"}
        </button>
      </form>
    </div>
  );
};

export default AdminSkillMapPage;
