import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const SkillDetail = () => {
  const { id } = useParams(); // ✅ Ensure correct skill ID is obtained from the route
  const [skill, setSkill] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid skill ID.");
      return;
    }
    fetchSkillDetails();
  }, [id]); // ✅ Ensure useEffect re-runs when ID changes

  const fetchSkillDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/skill-maps/${id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch skill details: ${res.statusText}`);
      }
      const data = await res.json();
      setSkill(data);
    } catch (error) {
      console.error("Error fetching skill details:", error);
      setError("Failed to fetch skill details.");
    }
  };

  const toggleTopic = (index) => {
    setExpandedTopics((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!skill) return <div className="text-center mt-10">Loading skill details...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4">{skill.skillName}</h1>

        {/* Learning Path Display */}
        <h2 className="text-xl font-semibold mt-6 mb-4">📌 Learning Path</h2>
        <div className="space-y-3">
          {skill.learningPath.map((topic, index) => (
            <div key={index} className="border p-4 rounded-md bg-gray-50">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleTopic(index)}
              >
                <h3 className="text-lg font-semibold">{topic.topic}</h3>
                <span className="text-gray-600">{expandedTopics[index] ? "▲" : "▼"}</span>
              </div>

              {/* Subtopics */}
              {expandedTopics[index] && topic.subtopics && (
                <div className="ml-5 mt-3 space-y-2">
                  {topic.subtopics.map((sub, subIndex) => (
                    <div key={subIndex} className="p-3 border-l-4 border-blue-500">
                      <h4 className="font-semibold">{sub.name}</h4>
                      {sub.resources && sub.resources.length > 0 && (
                        <ul className="ml-4 list-disc text-sm text-gray-600">
                          {sub.resources.map((res, resIndex) => (
                            <li key={resIndex}>
                              <a
                                href={res}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {res}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <h2 className="text-xl font-semibold mt-6 mb-4">🎥 Additional Resources</h2>
        <div className="space-y-3">
          {/* Course Links */}
          {skill.courseLinks && skill.courseLinks.length > 0 && (
            <div>
              <h3 className="font-semibold">📚 Recommended Courses:</h3>
              <ul className="ml-4 list-disc text-blue-500">
                {skill.courseLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* YouTube Links */}
          {skill.youtubeLinks && skill.youtubeLinks.length > 0 && (
            <div>
              <h3 className="font-semibold">📺 YouTube References:</h3>
              <ul className="ml-4 list-disc text-red-500">
                {skill.youtubeLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;
