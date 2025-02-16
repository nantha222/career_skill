import SkillCard from "../components/SkillCard";
import { useEffect, useState } from "react";
import axios from "axios";

const Explore = () => {
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/skills")
            .then((response) => setSkills(response.data))
            .catch((error) => console.error("Error fetching skills", error));
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-4">Explore Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {skills.map((skill, index) => (
                    <SkillCard key={index} skill={skill} />
                ))}
            </div>
        </div>
    );
};

export default Explore;
