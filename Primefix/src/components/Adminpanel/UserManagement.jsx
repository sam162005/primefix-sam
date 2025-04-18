import React, { useState, useEffect } from "react";
import "./UserManagement.css";


const UserManagement = () => {
  const [users, setUsers] = useState([]);

  // Dummy data (replace with API call)
  useEffect(() => {
    setUsers([
      { id: 1, name: "John Doe", complaint: "Service delay", status: "Pending", refund: false },
      { id: 2, name: "Jane Smith", complaint: "Overcharged", status: "Resolved", refund: true },
      { id: 3, name: "Alice Brown", complaint: "Rude technician", status: "In Progress", refund: false },
    ]);
  }, []);

  // Handle Status Change
  const updateStatus = (id, newStatus) => {
    setUsers(users.map(user => user.id === id ? { ...user, status: newStatus } : user));
  };

  // Handle Refund Action
  const processRefund = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, refund: true } : user));
    alert("Refund processed successfully!");
  };

  return (
    <div className="user-management-container">
      <h2>User Management</h2>
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Complaint</th>
              <th>Status</th>
              <th>Refund</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.complaint}</td>
                <td>
                  <select
                    className="status-select"
                    value={user.status}
                    onChange={(e) => updateStatus(user.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td className={user.refund ? "refund-processed" : "refund-pending"}>
                  {user.refund ? "Processed" : "Pending"}
                </td>
                <td>
                  {!user.refund && (
                    <button className="refund-button" onClick={() => processRefund(user.id)}>
                      Process Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
