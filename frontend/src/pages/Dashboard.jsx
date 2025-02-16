import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/login"); // Redirect if no user
        } else {
            setUser(storedUser);
            fetchRecommendedSkills(); // Fetch recommended skills
        }
    }, [navigate]);

    // Simulated skill recommendations
    const fetchRecommendedSkills = () => {
        setSkills([
            { id: 1, name: "Machine Learning", description: "Learn AI models and neural networks.", color: "bg-blue-500" },
            { id: 2, name: "Full-Stack Development", description: "Master React, Node.js, and databases.", color: "bg-green-500" },
            { id: 3, name: "Blockchain", description: "Explore Web3, Solidity, and Smart Contracts.", color: "bg-purple-500" },
        ]);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* ✅ Navbar */}
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

            {/* ✅ Main Content */}
            <div className="container mx-auto px-6 pt-24">
                {/* ✅ Welcome Section */}
                {user && (
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold">Welcome, {user.name}! 👋</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Here are your recommended skills:</p>
                    </div>
                )}

                {/* ✅ Recommended Skills Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((skill) => (
                        <div key={skill.id} className={`p-6 rounded-lg shadow-lg text-white ${skill.color} transform hover:scale-105 transition duration-300`}>
                            <h3 className="text-lg font-bold">{skill.name}</h3>
                            <p className="text-sm mt-2">{skill.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
