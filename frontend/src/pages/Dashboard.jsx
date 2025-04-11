import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { GiArtificialIntelligence } from "react-icons/gi";
import axios from "axios";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [predictedSkill, setPredictedSkill] = useState("");

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
        axios.get("http://localhost:5000/api/predicted-skill")
            .then((response) => {
                setPredictedSkill(response.data.skill);
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
                            <Link to="/dashboard" className="flex items-center gap-1 hover:text-blue-500">
                                <AiOutlineHome size={20} /> Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/questionnaire" className="flex items-center gap-1 hover:text-blue-500">
                                <GiArtificialIntelligence size={20} /> Predict
                            </Link>
                        </li>
                        <li>
                            <Link to="/explore" className="flex items-center gap-1 hover:text-blue-500">
                                <MdExplore size={20} /> Explore
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile" className="flex items-center gap-1 hover:text-blue-500">
                                <FaUserCircle size={20} /> Profile
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 hover:text-red-600">
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
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Here is your predicted skill:</p>
                    </div>
                )}

                {/* Predicted Skill Section */}
                {predictedSkill && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-6 rounded-lg shadow-lg text-white bg-blue-500 transform hover:scale-105 transition duration-300">
                            <h3 className="text-lg font-bold">Predicted Skill</h3>
                            <p className="text-sm mt-2">{predictedSkill}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
