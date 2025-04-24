import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { GiArtificialIntelligence } from "react-icons/gi";
import axios from "axios";
import skillsData from "../data/skills.json"; // Assuming you have a JSON file with skill data

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [predictedSkill, setPredictedSkill] = useState("");
  const [predictedSkillDetail, setPredictedSkillDetail] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login"); // Redirect if no user
    } else {
      setUser(storedUser);
      fetchPredictedSkill(); // Fetch the predicted skill
    }
  }, [navigate]);

  const fetchPredictedSkill = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.userId) return;

    axios
      .get(
        `http://localhost:5000/api/predicted-skill?userId=${storedUser.userId}`
      )
      .then((response) => {
        const predicted = response.data.skill;
        setPredictedSkill(predicted);

        // Match with JSON data
        const matchedSkill = skillsData.find((s) => s.skillName === predicted);
        setPredictedSkillDetail(matchedSkill);
      })
      .catch((error) => {
        console.error("Error fetching predicted skill", error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Career Skill Map</h1>
          <ul className="flex items-center space-x-6">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center gap-1 hover:text-blue-500"
              >
                <AiOutlineHome size={20} /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/questionnaire"
                className="flex items-center gap-1 hover:text-blue-500"
              >
                <GiArtificialIntelligence size={20} /> Predict
              </Link>
            </li>
            <li>
              <Link
                to="/explore"
                className="flex items-center gap-1 hover:text-blue-500"
              >
                <MdExplore size={20} /> Explore
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-1 hover:text-blue-500"
              >
                <FaUserCircle size={20} /> Profile
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
        {/* Welcome Section */}
        {user && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">Welcome, {user.name}! 👋</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Here is your predicted skill:
            </p>
          </div>
        )}

        {/* Predicted Skill Section */}
        {predictedSkillDetail && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">
              Learning Path for {predictedSkillDetail.skillName}
            </h3>
            <div className="space-y-4">
              {predictedSkillDetail.learningPath.map((topic, index) => (
                <div
                  key={index}
                  className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg"
                >
                  <h4 className="font-semibold">{topic.topic}</h4>
                  {topic.subtopics.map((sub, subIndex) => (
                    <div key={subIndex} className="mt-2">
                      <p className="font-medium text-sm">{sub.name}</p>
                      <ul className="list-disc list-inside text-sm text-blue-500">
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
