import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Questionnaire from "./pages/Questionnaire";
import AdminDashboard from "./pages/AdminPage";
import AdminRoute from "./components/AdminRoute";
import Login from "./pages/LoginPage";
import Register from "./pages/registerPage";

function App() {
  const [user, setUser] = useState(null);
  const [visitedQuestionnaire, setVisitedQuestionnaire] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    setVisitedQuestionnaire(localStorage.getItem("visitedQuestionnaire") === "true"); 
  }, []);

  return (
    <Router>
      <Routes>
        {/* ✅ Default Route - Redirects users based on questionnaire completion */}
        <Route 
          path="/" 
          element={
            user 
              ? visitedQuestionnaire 
                ? <Navigate to="/dashboard" />  // If they have completed the questionnaire, go to Dashboard
                : <Navigate to="/questionnaire" /> // If not, go to Questionnaire first
              : <Navigate to="/login" />
          } 
        />

        {/* ✅ Authentication Routes */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Protected User Routes */}
        {user && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
            <Route 
              path="/questionnaire" 
              element={
                <Questionnaire onComplete={() => localStorage.setItem("visitedQuestionnaire", "true")} />
              } 
            />
          </>
        )}

        {/* ✅ Admin Route (Protected) */}
        {user?.email === "admin@gmail.com" && (
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        )}

        {/* ✅ Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
