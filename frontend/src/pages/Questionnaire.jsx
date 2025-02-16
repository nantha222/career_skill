import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const QuestionnairePage = () => {
    const navigate = useNavigate(); // React Router navigation
    const [darkMode, setDarkMode] = useState(false);
    const [step, setStep] = useState(1); // Step state to control form visibility
    const [formData, setFormData] = useState({
        age: "",
        education: "",
        occupation: "",
        interest: "",
        experience: "",
    });

    const [prediction, setPrediction] = useState("");
    const [relatedSkills, setRelatedSkills] = useState([]);
    const [errors, setErrors] = useState({});

    const skills = {
        "AI/ML": {
            Beginner: ["Python Basics", "Data Science Fundamentals"],
            Intermediate: ["TensorFlow", "PyTorch"],
            Advanced: ["Deep Learning", "AI Model Optimization"],
        },
        "Full Stack Development": {
            Beginner: ["HTML, CSS, JavaScript"],
            Intermediate: ["React, Node.js"],
            Advanced: ["GraphQL, Microservices"],
        },
        "Blockchain": {
            Beginner: ["Crypto Basics", "Ethereum"],
            Intermediate: ["Solidity", "Web3.js"],
            Advanced: ["Hyperledger", "Smart Contracts Security"],
        },
        "Cloud Computing": {
            Beginner: ["AWS Fundamentals", "Azure Basics"],
            Intermediate: ["Cloud Security", "Kubernetes"],
            Advanced: ["Serverless Architecture", "Multi-Cloud Strategies"],
        },
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.age) newErrors.age = "Age is required.";
        if (formData.age && (formData.age < 18 || formData.age > 40)) newErrors.age = "Age must be between 18 and 40.";
        if (!formData.education) newErrors.education = "Education level is required.";
        if (formData.age < 22 && formData.education === "Master's") newErrors.education = "Master’s is not available under age 22.";
        if (!formData.occupation) newErrors.occupation = "Occupation is required.";
        if (!formData.interest) newErrors.interest = "Interest is required.";
        if (!formData.experience) newErrors.experience = "Experience level is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
    
        // Auto-suggestions for related skills
        if (name === "interest" || name === "experience") {
            const selectedInterest = updatedFormData.interest; // Get updated interest value
            const selectedExperience = updatedFormData.experience; // Get updated experience level
    
            if (selectedInterest && selectedExperience && skills[selectedInterest]?.[selectedExperience]) {
                setRelatedSkills(skills[selectedInterest][selectedExperience]);
            } else {
                setRelatedSkills([]);
            }
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post("http://localhost:5000/api/ml/predict", formData);
            setPrediction(response.data.skill);
        } catch (error) {
            console.error("Prediction failed:", error);
        }
    };

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900"} min-h-screen flex flex-col items-center justify-center p-6`}>
            {/* Dark Mode Toggle */}
            <button 
                onClick={() => setDarkMode(!darkMode)} 
                className="absolute top-4 right-4 bg-gray-700 text-white px-4 py-2 rounded-md"
            >
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {/* Step 1: Ask if they know what to study */}
            {step === 1 ? (
                <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg w-full max-w-md text-center`}>
                    <h2 className="text-xl font-semibold mb-4">Do you know what to study?</h2>
                    <div className="flex justify-center gap-4">
                        <button 
                            onClick={() => navigate("/dashboard")} // Navigate to Dashboard
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                            Yes, take me to the dashboard
                        </button>
                        <button 
                            onClick={() => setStep(2)} // Go to next step
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            No, help me decide
                        </button>
                    </div>
                </div>
            ) : (
                // Step 2: Show Questionnaire
                <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg w-full max-w-md`}>
                    <h2 className="text-xl font-semibold text-center mb-4">Skill Prediction</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Age */}
                    <div>
                        <label className="block text-sm font-medium">Age</label>
                        <input 
                            type="number" 
                            name="age" 
                            value={formData.age} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        />
                        {errors.age && <p className="text-red-500 text-xs">{errors.age}</p>}
                    </div>

                    {/* Education Level */}
                    <div>
                        <label className="block text-sm font-medium">Education Level</label>
                        <select 
                            name="education" 
                            value={formData.education} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select</option>
                            <option value="High School">High School</option>
                            <option value="Bachelor's">Bachelor's</option>
                            {formData.age >= 22 && <option value="Master's">Master's</option>}
                            {formData.age >= 25 && <option value="PhD">PhD</option>}
                        </select>
                        {errors.education && <p className="text-red-500 text-xs">{errors.education}</p>}
                    </div>

                    {/* Occupation */}
                    <div>
                        <label className="block text-sm font-medium">Occupation</label>
                        <select 
                            name="occupation" 
                            value={formData.occupation} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select</option>
                            <option value="Student">Student</option>
                            <option value="Job Seeker">Job Seeker</option>
                            <option value="Working Professional">Working Professional</option>
                        </select>
                        {errors.occupation && <p className="text-red-500 text-xs">{errors.occupation}</p>}
                    </div>

                    {/* Interest */}
                    <div>
                        <label className="block text-sm font-medium">Field of Interest</label>
                        <select 
                            name="interest" 
                            value={formData.interest} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select</option>
                            {Object.keys(skills).map(skill => (
                                <option key={skill} value={skill}>{skill}</option>
                            ))}
                        </select>
                        {errors.interest && <p className="text-red-500 text-xs">{errors.interest}</p>}
                    </div>

                    {/* Experience Level */}
                    <div>
                        <label className="block text-sm font-medium">Experience Level</label>
                        <select 
                            name="experience" 
                            value={formData.experience} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    {/* Suggested Skills */}
                    {relatedSkills.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium">Suggested Skills</label>
                            <ul className="text-sm text-gray-600 dark:text-gray-300">
                                {relatedSkills.map((skill, index) => (
                                    <li key={index} className="list-disc ml-4 text-black ">{skill}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                        Predict Skill
                    </button>
                </form>
                </div>
            )}
        </div>
    );
};

export default QuestionnairePage;
