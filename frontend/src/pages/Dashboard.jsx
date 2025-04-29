import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { GiArtificialIntelligence } from "react-icons/gi";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // 🔥 Added animation library

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [predictedSkill, setPredictedSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isHomeTab, setIsHomeTab] = useState(true);

  const topics = ["AI/ML", "Web Development", "Cybersecurity", "Blockchain", "Cloud Computing"];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchPredictedSkill();
    }

    fetchAllSkills();
  }, [navigate]);

  const fetchPredictedSkill = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.userId) return;

    axios
      .get(`http://localhost:5000/api/predicted-skill?userId=${storedUser.userId}`)
      .then((response) => {
        const predicted = response.data.skill;
        setPredictedSkill(predicted);
      })
      .catch((error) => {
        console.error("Error fetching predicted skill", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchAllSkills = () => {
    axios
      .get("http://localhost:5000/api/skill-maps")
      .then((response) => {
        setAllSkills(response.data);
      })
      .catch((error) => console.error("Error fetching all skills", error));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleTabChange = (tab) => {
    if (tab === "home") {
      setIsHomeTab(true);
      setSelectedSkill(null);
    } else {
      setIsHomeTab(false);
      setSelectedSkill(null);
      fetchPredictedSkill();
    }
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setSelectedSkill(null);

    let filtered = [];

    if (topic === "AI/ML") {
      filtered = allSkills.filter(skill =>
        skill.skillName.toLowerCase().includes("ai") ||
        skill.skillName.toLowerCase().includes("ml") ||
        skill.skillName.toLowerCase().includes("machine learning")
      );
    } else if (topic === "Web Development") {
      filtered = allSkills.filter(skill =>
        skill.skillName.toLowerCase().includes("web") ||
        skill.skillName.toLowerCase().includes("frontend") ||
        skill.skillName.toLowerCase().includes("backend")
      );
    } else if (topic === "Cybersecurity") {
      filtered = allSkills.filter(skill =>
        skill.skillName.toLowerCase().includes("security") ||
        skill.skillName.toLowerCase().includes("cyber") ||
        skill.skillName.toLowerCase().includes("cryptography")
      );
    } else if (topic === "Blockchain") {
      filtered = allSkills.filter(skill =>
        skill.skillName.toLowerCase().includes("blockchain") ||
        skill.skillName.toLowerCase().includes("defi")
      );
    } else if (topic === "Cloud Computing") {
      filtered = allSkills.filter(skill =>
        skill.skillName.toLowerCase().includes("cloud") ||
        skill.skillName.toLowerCase().includes("aws") ||
        skill.skillName.toLowerCase().includes("azure") ||
        skill.skillName.toLowerCase().includes("gcp")
      );
    }

    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setFilteredSkills(shuffled.slice(0, 5));
  };

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
  };

  const handleBackToSkills = () => {
    setSelectedSkill(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Career Skill Map</h1>
          <ul className="flex items-center space-x-6">
            <li>
              <button
                onClick={() => handleTabChange("home")}
                className="flex items-center gap-1 hover:text-blue-500"
              >
                <AiOutlineHome size={20} /> Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("predict")}
                className="flex items-center gap-1 hover:text-blue-500"
              >
                <GiArtificialIntelligence size={20} /> Predict
              </button>
            </li>
            <li>
              <Link to="/explore" className="flex items-center gap-1 hover:text-blue-500">
                <MdExplore size={20} /> Explore
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:text-red-600"
              >
                <FiLogOut size={20} /> Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-24">
        {loading ? (
          <div className="flex justify-center items-center mt-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {user && (
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold">Welcome, {user.name}! 👋</h2>
              </div>
            )}

            {!isHomeTab && predictedSkill && (
              <div className="text-center mb-8">
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Your predicted skill:
                </p>
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-blue-500">{predictedSkill}</h3>
                </div>
              </div>
            )}

            {/* Skills List */}
            {isHomeTab && !selectedSkill && (
              <>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {topics.map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => handleTopicClick(topic)}
                      className="px-6 py-3 rounded-full font-semibold bg-blue-600 text-white shadow-md hover:bg-blue-500 transition"
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                {selectedTopic && (
                  <div>
                    <h3 className="text-xl font-bold mb-6 text-center">
                      Skills in {selectedTopic}
                    </h3>

                    {filteredSkills.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {filteredSkills.map((skill) => (
                          <div
                            key={skill._id}
                            onClick={() => handleSkillClick(skill)}
                            className="p-6 rounded-lg shadow-lg bg-blue-500 text-white cursor-pointer hover:scale-105 transition"
                          >
                            <h3 className="text-lg font-bold">{skill.skillName}</h3>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-lg shadow-inner bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-center">
                        <h3 className="text-lg font-semibold">No skills available yet!</h3>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Skill Detail View with Animation */}
            <AnimatePresence mode="wait">
              {selectedSkill && (
                <motion.div
                  key={selectedSkill._id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="p-6"
                >
                  <button
                    onClick={handleBackToSkills}
                    className="mb-4 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
                  >
                    ← Back to Skills
                  </button>

                  <h2 className="text-3xl font-bold mb-6 text-center">{selectedSkill.skillName}</h2>

                  {selectedSkill.learningPath && selectedSkill.learningPath.length > 0 && (
                    <div className="space-y-6">
                      {selectedSkill.learningPath.map((topic, index) => (
                        <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                          <h3 className="text-xl font-semibold mb-4">{topic.topic}</h3>
                          <div className="space-y-3">
                            {topic.subtopics.map((sub, idx) => (
                              <div key={idx}>
                                <h4 className="font-bold">{sub.name}</h4>
                                <ul className="list-disc list-inside text-blue-500 ml-4">
                                  {sub.resources.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                      <a
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                      >
                                        Resource {linkIndex + 1}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-center mt-12">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      🔎 For more skills, check the{" "}
                      <Link to="/explore" className="text-blue-600 font-semibold hover:underline">
                        Explore
                      </Link>{" "}
                      tab!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
