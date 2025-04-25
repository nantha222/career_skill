import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminSkillListPage = () => {
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = () => {
        axios
            .get("http://localhost:5000/api/skill-maps")
            .then((response) => setSkills(response.data))
            .catch((error) => console.error("Error fetching skills", error));
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this skill?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/skill-maps/${id}`);
            setSkills(skills.filter(skill => skill._id !== id));
        } catch (error) {
            console.error("Error deleting skill", error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-4">Manage Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {skills.map((skill) => (
                    <div key={skill._id} className="relative">
                        <Link to={`/skill/${skill._id}`}>
                            <div className="p-6 rounded-lg shadow-lg bg-blue-500 text-white hover:scale-105 transition">
                                <h3 className="text-lg font-bold mb-2">{skill.skillName}</h3>
                            </div>
                        </Link>
                        <button
                            onClick={() => handleDelete(skill._id)}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs rounded"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminSkillListPage;
