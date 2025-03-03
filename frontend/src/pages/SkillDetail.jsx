import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SkillDetail = () => {
    const { id } = useParams();
    const [skill, setSkill] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        axios.get(`http://localhost:5000/api/skill-maps/${id}`)
            .then((response) => {
                setSkill(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching skill details", error);
                setError("Failed to fetch skill details");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!skill) return <p className="text-center text-gray-500">Skill not found</p>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-4">{skill.skillName}</h2>

            {/* ✅ Course Link */}
            {skill.courseLinks && skill.courseLinks.length > 0 && (
                <a href={skill.courseLinks[0]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mb-4 block">
                    View Full Course
                </a>
            )}

            {/* ✅ Topics & YouTube Links */}
            <div className="space-y-4">
                {skill.learningPath && skill.learningPath.length > 0 ? (
                    skill.learningPath.map((topic, index) => (
                        <div key={index} className="p-4 bg-gray-100 rounded-lg">
                            <h3 className="text-xl font-semibold">{topic.topic}</h3> {/* Ensure correct key */}
                            {skill.youtubeLinks && skill.youtubeLinks[index] && (
                                <a href={skill.youtubeLinks[index]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline block mt-2">
                                    Watch on YouTube
                                </a>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No learning topics available.</p>
                )}
            </div>
        </div>
    );
};

export default SkillDetail;
