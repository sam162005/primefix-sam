// src/components/Technicianpanel/Profile.jsx
import React, { useState } from "react";
import "./Profile.css";
import { Pencil, Save, Upload, ToggleLeft, ToggleRight, PlusCircle } from "lucide-react";
import technicianImg from "../../assets/technician.jpg";

const Profile = () => {
  const [availability, setAvailability] = useState("Available");

  const [technician, setTechnician] = useState({
    name: "Ravi Kumar",
    email: "ravi.kumar@example.com",
    phone: "+91 98765 43210",
    address: "Chennai, Tamil Nadu",
    skills: ["Electrician", "Plumber"],
    idProof: "Aadhar Card - XXXXXX1234",
    profileImg: technicianImg,
  });

  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const toggleAvailability = () =>
    setAvailability((prev) => (prev === "Available" ? "Unavailable" : "Available"));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTechnician((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillAdd = () => {
    if (newSkill.trim() !== "") {
      setTechnician((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTechnician((prev) => ({ ...prev, profileImg: imageUrl }));
    }
  };

  return (
    <div className="profile-container">
      <h2>👷 Technician Profile</h2>

      <div className="profile-card">
        <div className="profile-left">
          <img
            src={technician.profileImg}
            alt="Technician"
            className="profile-img"
          />

          <span className={`status-tag ${availability.toLowerCase()}`}>
            {availability}
          </span>

          <button className="toggle-btn" onClick={toggleAvailability}>
            {availability === "Available" ? (
              <>
                <ToggleRight size={20} /> Set Unavailable
              </>
            ) : (
              <>
                <ToggleLeft size={20} /> Set Available
              </>
            )}
          </button>

          {/* Upload New Picture */}
          {editing && (
            <div className="upload-section">
              <label htmlFor="upload-photo" className="upload-btn">
                <Upload size={16} /> Upload Photo
              </label>
              <input
                id="upload-photo"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </div>
          )}
        </div>

        <div className="profile-right">
          <div className="profile-header">
            {editing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={technician.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                />
                <button className="save-btn" onClick={() => setEditing(false)}>
                  <Save size={16} /> Save
                </button>
              </>
            ) : (
              <>
                <h3>{technician.name}</h3>
                <button className="edit-btn" onClick={() => setEditing(true)}>
                  <Pencil size={16} /> Edit
                </button>
              </>
            )}
          </div>

          {/* Other Fields */}
          {editing ? (
            <>
              <input
                type="email"
                name="email"
                value={technician.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="phone"
                value={technician.phone}
                onChange={handleInputChange}
                placeholder="Phone"
              />
              <input
                type="text"
                name="address"
                value={technician.address}
                onChange={handleInputChange}
                placeholder="Address"
              />
              <input
                type="text"
                name="idProof"
                value={technician.idProof}
                onChange={handleInputChange}
                placeholder="ID Proof"
              />
            </>
          ) : (
            <>
              <p><strong>Email:</strong> {technician.email}</p>
              <p><strong>Phone:</strong> {technician.phone}</p>
              <p><strong>Location:</strong> {technician.address}</p>
              <p><strong>ID Proof:</strong> {technician.idProof}</p>
            </>
          )}

          {/* Skills Section */}
          <div className="skills">
            <strong>Skills:</strong>
            <div className="skill-tags">
              {technician.skills.map((skill, index) => (
                <span className="skill-tag" key={index}>🔧 {skill}</span>
              ))}
            </div>

            {editing && (
              <div className="add-skill-section">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add New Skill"
                />
                <button onClick={handleSkillAdd}>
                  <PlusCircle size={16} /> Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
