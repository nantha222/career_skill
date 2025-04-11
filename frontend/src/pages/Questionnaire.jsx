import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const QuestionnairePage = ({ onComplete }) => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        Age: "",
        Education: "",
        Occupation: "",
        Interest: "",
        Experience: "",
        LearningStyle: "",
        TimeCommitment: "",
        PreferredResources: ""
    });

    const [prediction, setPrediction] = useState("");
    const [isFinalized, setIsFinalized] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Check if the questionnaire has been completed
        const visited = localStorage.getItem("visitedQuestionnaire") === "true";
        if (visited) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.Age) newErrors.Age = "Age is required.";
        if (formData.Age && (formData.Age < 18 || formData.Age > 40)) newErrors.Age = "Age must be between 18 and 40.";
        if (!formData.Education) newErrors.Education = "Education level is required.";
        if (!formData.Occupation) newErrors.Occupation = "Occupation is required.";
        if (!formData.Interest) newErrors.Interest = "Field of Interest is required.";
        if (!formData.Experience) newErrors.Experience = "Experience level is required.";
        if (!formData.LearningStyle) newErrors.LearningStyle = "Learning style is required.";
        if (!formData.TimeCommitment) newErrors.TimeCommitment = "Time commitment is required.";
        if (!formData.PreferredResources) newErrors.PreferredResources = "Preferred resources are required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const userId = "user123"; // Replace with actual user ID retrieval logic

        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", formData);

            if (response.data.skill) {
                setPrediction(response.data.skill);

                // Save the predicted skill to the database
                await axios.post("http://localhost:5000/api/save-prediction", { userId, skill: response.data.skill });

                // Mark questionnaire as completed
                onComplete();
            } else {
                console.error("No skill returned from API", response.data);
                setPrediction("No skill prediction available.");
            }
        } catch (error) {
            console.error("Prediction failed:", error);
            setPrediction("Error: Could not get a prediction.");
        }
    };

    const handleFinalize = () => {
        setIsFinalized(true);
        navigate("/dashboard");
    };

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900"} min-h-screen flex flex-col items-center justify-center p-6`}>
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="absolute top-4 right-4 bg-gray-700 text-white px-4 py-2 rounded-md"
            >
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {step === 1 ? (
                <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg w-full max-w-md text-center`}>
                    <h2 className="text-xl font-semibold mb-4">Do you know what to study?</h2>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => navigate("/dashboard")} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                            Yes, take me to the dashboard
                        </button>
                        <button onClick={() => setStep(2)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                            No, help me decide
                        </button>
                    </div>
                </div>
            ) : (
                <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg w-full max-w-md`}>
                    <h2 className="text-xl font-semibold text-center mb-4">Skill Prediction</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Age */}
                        <div>
                            <label className="block text-sm font-medium">Age</label>
                            <input type="number" name="Age" value={formData.Age} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
                            {errors.Age && <span className="text-red-500 text-sm">{errors.Age}</span>}
                        </div>

                        {/* Education Level */}
                        <div>
                            <label className="block text-sm font-medium">Education Level</label>
                            <select name="Education" value={formData.Education} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white">
                                <option value="">Select</option>
                                <option value="High School">High School</option>
                                <option value="Bachelor's">Bachelor's</option>
                                {formData.Age >= 22 && <option value="Master's">Master's</option>}
                                {formData.Age >= 25 && <option value="PhD">PhD</option>}
                            </select>
                            {errors.Education && <span className="text-red-500 text-sm">{errors.Education}</span>}
                        </div>

                        {/* Occupation */}
                        <div>
                            <label className="block text-sm font-medium">Occupation</label>
                            <select name="Occupation" value={formData.Occupation} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white">
                                <option value="">Select</option>
                                <option value="Student">Student</option>
                                <option value="Job Seeker">Job Seeker</option>
                                <option value="Working Professional">Working Professional</option>
                            </select>
                            {errors.Occupation && <span className="text-red-500 text-sm">{errors.Occupation}</span>}
                        </div>

                        {/* Field of Interest */}
                        <div>
                            <label className="block text-sm font-medium">Field of Interest</label>
                            <select name="Interest" value={formData.Interest} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white">
                                <option value="">Select</option>
                                <option value="AI/ML">AI/ML</option>
                                <option value="Blockchain">Blockchain</option>
                                <option value="Cloud Computing">Cloud Computing</option>
                                <option value="Full Stack Development">Full Stack Development</option>
                                <option value="Networking">Networking</option>
                            </select>
                            {errors.Interest && <span className="text-red-500 text-sm">{errors.Interest}</span>}
                        </div>

                        {/* Experience Level */}
                        <div>
                            <label className="block text-sm font-medium">Experience Level</label>
                            <select name="Experience" value={formData.Experience} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white">
                                <option value="">Select</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                            {errors.Experience && <span className="text-red-500 text-sm">{errors.Experience}</span>}
                        </div>

                        {/* Learning Style */}
                        <div>
                            <label className="block text-sm font-medium">Learning Style</label>
                            <select name="LearningStyle" value={formData.LearningStyle} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white">
                                <option value="">Select</option>
                                <option value="Visual">Visual</option>
                                <option value="Auditory">Auditory</option>
                                <option value="Reading/Writing">Reading/Writing</option>
                                <option value="Kinesthetic">Kinesthetic</option>
                            </select>
                            {errors.LearningStyle && <span className="text-red-500 text-sm">{errors.LearningStyle}</span>}
                        </div>

                        {/* Time Commitment */}
                        <div>
                            <label className="block text-sm font-medium">Time Commitment</label>
                            <select name="TimeCommitment" value={formData.TimeCommitment} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white">
                                <option value="">Select</option>
                                <option value="<5 hrs/week">Less than 5 hours</option>
                                <option value="5-10 hrs/week">5-10 hours</option>
                                <option value=">10 hrs/week">More than 10 hours</option>
                            </select>
                        </div>

                        {/* Preferred Resources */}
                        <div>
                            <label className="block text-sm font-medium">Preferred Resources</label>
                            <select name="PreferredResources" value={formData.PreferredResources} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white">
                                <option value="">Select</option>
                                <option value="Free">Free</option>
                                <option value="Paid">Paid</option>
                                <option value="Free & Paid">Free & Paid</option>
                            </select>
                            {errors.PreferredResources && <span className="text-red-500 text-sm">{errors.PreferredResources}</span>}
                        </div>

                        {prediction && (
                            <div className="bg-green-200 text-green-800 p-4 mt-4 rounded-md">
                                <strong>Predicted Skill:</strong> {prediction}
                            </div>
                        )}

                        {prediction && !isFinalized ? (
                            <button onClick={handleFinalize} className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 mt-4">
                                Finalize
                            </button>
                        ) : (
                            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                                Predict Skill
                            </button>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
};

export default QuestionnairePage;
