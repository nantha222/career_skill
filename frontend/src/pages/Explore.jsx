import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Explore = () => {
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/skill-maps")
            .then((response) => setSkills(response.data))
            .catch((error) => console.error("Error fetching skills", error));
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-4">Explore Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {skills.map((skill) => (
                    <Link to={`/skill/${skill._id}`} key={skill._id}>
                        <div className="p-6 rounded-lg shadow-lg bg-blue-500 text-white cursor-pointer hover:scale-105 transition">
                            <h3 className="text-lg font-bold">{skill.skillName}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Explore;
    