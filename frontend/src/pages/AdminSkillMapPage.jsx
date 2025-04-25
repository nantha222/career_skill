import { useState } from "react";
import axios from "axios";

const AdminSkillMapPage = () => {
  const [skillName, setSkillName] = useState("");
  const [topics, setTopics] = useState([{ topic: "", subtopics: [{ name: "", resources: [""] }] }]);
  const [message, setMessage] = useState("");

  const handleAddTopic = () => {
    setTopics([...topics, { topic: "", subtopics: [{ name: "", resources: [""] }] }]);
  };

  const handleAddSubtopic = (topicIndex) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].subtopics.push({ name: "", resources: [""] });
    setTopics(updatedTopics);
  };

  const handleAddResource = (topicIndex, subIndex) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].subtopics[subIndex].resources.push("");
    setTopics(updatedTopics);
  };

  const handleChange = (topicIndex, subIndex, field, value, resourceIndex = null) => {
    const updatedTopics = [...topics];
    if (field === "topic") {
      updatedTopics[topicIndex].topic = value;
    } else if (field === "subtopic") {
      updatedTopics[topicIndex].subtopics[subIndex].name = value;
    } else if (field === "resource") {
      updatedTopics[topicIndex].subtopics[subIndex].resources[resourceIndex] = value;
    }
    setTopics(updatedTopics);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      skillName,
      learningPath: topics.map((t, index) => ({
        topic: t.topic,
        order: index + 1,
        subtopics: t.subtopics
      })),
    };

    try {
      await axios.post("http://localhost:5000/api/skill-maps", payload);
      setMessage("Skill Map created successfully!");
      setSkillName("");
      setTopics([{ topic: "", subtopics: [{ name: "", resources: [""] }] }]);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create skill map");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create Skill Map</h2>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Skill Name"
          className="w-full p-2 border rounded"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          required
        />

        {topics.map((topic, topicIndex) => (
          <div key={topicIndex} className="p-4 border rounded mb-2 bg-gray-50">
            <input
              type="text"
              placeholder="Topic Title"
              className="w-full mb-2 p-2 border rounded"
              value={topic.topic}
              onChange={(e) => handleChange(topicIndex, null, "topic", e.target.value)}
              required
            />

            {topic.subtopics.map((sub, subIndex) => (
              <div key={subIndex} className="ml-4 mb-2">
                <input
                  type="text"
                  placeholder="Subtopic Name"
                  className="w-full p-2 border rounded mb-1"
                  value={sub.name}
                  onChange={(e) => handleChange(topicIndex, subIndex, "subtopic", e.target.value)}
                  required
                />
                {sub.resources.map((res, resIndex) => (
                  <input
                    key={resIndex}
                    type="text"
                    placeholder="Resource Link"
                    className="w-full p-2 border rounded mb-1"
                    value={res}
                    onChange={(e) => handleChange(topicIndex, subIndex, "resource", e.target.value, resIndex)}
                    required
                  />
                ))}
                <button
                  type="button"
                  className="text-blue-500 text-sm"
                  onClick={() => handleAddResource(topicIndex, subIndex)}
                >
                  + Add Resource
                </button>
              </div>
            ))}

            <button
              type="button"
              className="text-green-600 mt-1 text-sm"
              onClick={() => handleAddSubtopic(topicIndex)}
            >
              + Add Subtopic
            </button>
          </div>
        ))}

        <button
          type="button"
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={handleAddTopic}
        >
          + Add Topic
        </button>

        <button
          type="submit"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
        >
          Create Skill Map
        </button>
      </form>
    </div>
  );
};

export default AdminSkillMapPage;
