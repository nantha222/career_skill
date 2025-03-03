import { useState } from "react";
import AdminSkillMapPage from "./AdminSkillMapPage"; // Import Skill Map Page

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("AdminSkillMap");

  const renderPage = () => {
    switch (activePage) {
      case "AdminSkillMap":
        return <AdminSkillMapPage />;
      default:
        return <div className="p-6">Select a section from the sidebar.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/5 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <ul className="space-y-2">
          <li
            className={`p-2 rounded-md cursor-pointer ${
              activePage === "AdminSkillMap" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActivePage("AdminSkillMap")}
          >
            📚 Skill Maps
          </li>
        </ul>
      </aside>

      {/* Content Area */}
      <main className="w-4/5 p-6">{renderPage()}</main>
    </div>
  );
};

export default AdminDashboard;
