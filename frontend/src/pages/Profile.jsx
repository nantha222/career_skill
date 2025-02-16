import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-4">Profile</h2>
            <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
                Logout
            </button>
        </div>
    );
};

export default Profile;
