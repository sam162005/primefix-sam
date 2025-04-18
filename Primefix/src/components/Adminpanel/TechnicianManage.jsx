import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TechnicianManage.css";


const TechnicianManage = () => {
  const [technicians, setTechnicians] = useState([]);
  const [newTech, setNewTech] = useState({ name: "", idCard: "", status: "Active", performance: "New" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/technician/";

  // Fetch Technicians from API
  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const response = await axios.get(API_URL + "all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTechnicians(response.data);
    } catch (error) {
      console.error("Error fetching technicians:", error);
      setError("Failed to fetch technicians. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add Technician
  const addTechnician = async () => {
    if (!newTech.name || !newTech.idCard) {
      alert("Please fill all fields.");
      return;
    }
  
    const token = localStorage.getItem("token"); // Assuming you're storing token here
  
    try {
      await axios.post(API_URL + "add", newTech, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTechnicians();
      setNewTech({ name: "", idCard: "", status: "Active", performance: "New" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding technician:", error);
      alert("Failed to add technician");
    }
  };
  
  

  // Update Technician Status
  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        API_URL + id,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTechnicians();
    } catch (error) {
      console.error("Error updating technician status:", error);
      alert("Failed to update status.");
    }
  };

  // Remove Technician
  const removeTechnician = async (id) => {
    if (!window.confirm("Are you sure you want to remove this technician?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(API_URL + id, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTechnicians();
    } catch (error) {
      console.error("Error removing technician:", error);
      alert("Failed to remove technician.");
    }
  };

  return (
    <div className="technician-management-container">
      <h2>Technician Management</h2>

      <button className="add-btn" onClick={() => setShowForm(true)}>Add Technician</button>

      {/* Display Loading Message */}
      {loading && <p>Loading technicians...</p>}

      {/* Display Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Technician Form */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Technician</h3>
            <input
              type="text"
              placeholder="Name"
              value={newTech.name}
              onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="ID Card Number"
              value={newTech.idCard}
              onChange={(e) => setNewTech({ ...newTech, idCard: e.target.value })}
            />
            <button onClick={addTechnician}>Save</button>
            <button className="close-btn" onClick={() => setShowForm(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="technician-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>ID Card</th>
              <th>Status</th>
              <th>Performance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {technicians.map((tech) => (
              <tr key={tech._id}>
                <td>{tech._id}</td>
                <td>{tech.name}</td>
                <td>{tech.idCard}</td>
                <td>
                  <select
                    className="status-select"
                    value={tech.status}
                    onChange={(e) => updateStatus(tech._id, e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Blacklisted">Blacklisted</option>
                  </select>
                </td>
                <td>{tech.performance}</td>
                <td>
                  <button className="remove-btn" onClick={() => removeTechnician(tech._id)}>Remove</button>
                </td>
              </tr>
            ))}
            {!loading && technicians.length === 0 && <tr><td colSpan="6">No technicians found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TechnicianManage;
