import { useState, useEffect } from "react";

const AdminSkillMapPage = () => {
  const [skillMaps, setSkillMaps] = useState([]);
  const [formData, setFormData] = useState({
    skillName: "",
    learningPath: [{ topic: "", order: 1 }],
    courseLinks: [""],
    youtubeLinks: [""],
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSkillMaps();
  }, []);

  const fetchSkillMaps = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/skill-maps");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      console.log(data);
      setSkillMaps(data);
    } catch (error) {
      console.error("Error fetching skill maps", error);
    }
  };

  const handleInputChange = (e, field, index = null) => {
    const { name, value } = e.target;

    if (index !== null) {
      let updatedField = [...formData[field]];
      updatedField[index] = value;
      setFormData({ ...formData, [field]: updatedField });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeField = (field, index) => {
    let updatedField = [...formData[field]];
    updatedField.splice(index, 1);
    setFormData({ ...formData, [field]: updatedField });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `http://localhost:5000/api/skill-maps/${editingId}`
        : "http://localhost:5000/api/skill-maps";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      fetchSkillMaps();
      setFormData({ skillName: "", learningPath: [{ topic: "", order: 1 }], courseLinks: [""], youtubeLinks: [""] });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving skill map", error);
    }
  };

  const handleEdit = (skillMap) => {
    setFormData(skillMap);
    setEditingId(skillMap._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/skill-maps/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      fetchSkillMaps();
    } catch (error) {
      console.error("Error deleting skill map", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Skill Map Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">{editingId ? "Edit Skill Map" : "Create New Skill Map"}</h2>

        {/* Skill Name */}
        <input
          type="text"
          name="skillName"
          value={formData.skillName}
          onChange={handleInputChange}
          placeholder="Skill Name"
          required
          className="w-full p-2 border rounded-md mb-3"
        />

        {/* Learning Path */}
        <h3 className="text-md font-semibold">Learning Path</h3>
        {formData.learningPath.map((step, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Topic"
              value={step.topic}
              onChange={(e) => {
                let updatedPath = [...formData.learningPath];
                updatedPath[index].topic = e.target.value;
                setFormData({ ...formData, learningPath: updatedPath });
              }}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Order"
              value={step.order}
              onChange={(e) => {
                let updatedPath = [...formData.learningPath];
                updatedPath[index].order = e.target.value;
                setFormData({ ...formData, learningPath: updatedPath });
              }}
              className="w-20 p-2 border rounded-md"
            />
            <button type="button" onClick={() => removeField("learningPath", index)} className="bg-red-500 text-white px-3 py-1 rounded-md">
              ✖
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addField("learningPath")} className="bg-blue-500 text-white px-3 py-1 rounded-md mb-3">
          + Add Step
        </button>

        {/* Course Links */}
        <h3 className="text-md font-semibold">Relevant Courses</h3>
        {formData.courseLinks.map((link, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input type="url" placeholder="Course URL" value={link} onChange={(e) => handleInputChange(e, "courseLinks", index)} className="w-full p-2 border rounded-md" />
            <button type="button" onClick={() => removeField("courseLinks", index)} className="bg-red-500 text-white px-3 py-1 rounded-md">
              ✖
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addField("courseLinks")} className="bg-blue-500 text-white px-3 py-1 rounded-md mb-3">
          + Add Course
        </button>

        {/* YouTube Links */}
        <h3 className="text-md font-semibold">YouTube References</h3>
        {formData.youtubeLinks.map((link, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input type="url" placeholder="YouTube URL" value={link} onChange={(e) => handleInputChange(e, "youtubeLinks", index)} className="w-full p-2 border rounded-md" />
            <button type="button" onClick={() => removeField("youtubeLinks", index)} className="bg-red-500 text-white px-3 py-1 rounded-md">
              ✖
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addField("youtubeLinks")} className="bg-blue-500 text-white px-3 py-1 rounded-md mb-3">
          + Add YouTube Link
        </button>

        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-md">
          {editingId ? "Update Skill Map" : "Create Skill Map"}
        </button>
      </form>

      {/* Skill Maps List */}
      <h2 className="text-lg font-semibold mt-6">Existing Skill Maps</h2>
      <ul className="bg-white p-4 rounded-lg shadow-md">
        {skillMaps.map((map) => (
          <li key={map._id} className="flex justify-between items-center border-b p-2">
            <span>{map.skillName}</span>
            <div>
              <button onClick={() => handleEdit(map)} className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2">Edit</button>
              <button onClick={() => handleDelete(map._id)} className="bg-red-500 text-white px-2 py-1 rounded-md">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSkillMapPage;
