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
import AdminSkillMapPage from "./pages/AdminSkillMapPage";
import SkillDetail from "./pages/SkillDetail";

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
        <Route
          path="/"
          element={
            user
              ? visitedQuestionnaire
                ? <Navigate to="/questionnaire" />
                : <Navigate to="/questionnaire" />
              : <Navigate to="/login" />
          }
        />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {user && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin_map" element={<AdminSkillMapPage />} />
            <Route path="/skill/:id" element={<SkillDetail />} />

            <Route
              path="/questionnaire"
              element={
                <Questionnaire onComplete={() => {
                  localStorage.setItem("visitedQuestionnaire", "true");
                  setVisitedQuestionnaire(true);
                }} />
              }
            />
          </>
        )}

        {user?.email === "admin@gmail.com" && (
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        )}

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
