import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import "./ServiceRequests.css";
import "react-toastify/dist/ReactToastify.css";


const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch service requests from API
  const fetchRequests = async () => {
    try {
      const response = await axios.get("https://your-api.com/service-requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch service requests");
    }
  };

  // Handle Status Change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`https://your-api.com/service-requests/${id}`, { status: newStatus });
      toast.success("Status updated successfully!");
      fetchRequests();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  // Handle Technician Assignment
  const assignTechnician = async (id, technician) => {
    try {
      await axios.put(`https://your-api.com/service-requests/${id}/assign`, { technician });
      toast.success("Technician assigned successfully!");
      fetchRequests();
    } catch (error) {
      console.error("Error assigning technician:", error);
      toast.error("Failed to assign technician.");
    }
  };

  return (
    <Container className="sr-container">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mt: 3 }}>
        Service Requests
      </Typography>

      {/* Search & Filter Section */}
      <div className="search-filter-container">
        <TextField
          label="Search Requests"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </div>

      {/* Table */}
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead className="table-header">
            <TableRow>
              <TableCell><b>Customer</b></TableCell>
              <TableCell><b>Service Type</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Technician</b></TableCell>
              <TableCell><b>Payment</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests
              .filter((req) =>
                req.customer.toLowerCase().includes(search.toLowerCase()) &&
                (filterStatus ? req.status === filterStatus : true)
              )
              .map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="table-cell">{req.customer}</TableCell>
                  <TableCell className="table-cell">{req.serviceType}</TableCell>
                  <TableCell className="table-cell">
                    <Select
                      value={req.status}
                      onChange={(e) => handleStatusChange(req.id, e.target.value)}
                      className="status-select"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell className="table-cell">
                    <Select
                      value={req.technician || ""}
                      onChange={(e) => assignTechnician(req.id, e.target.value)}
                      displayEmpty
                      className="technician-select"
                    >
                      <MenuItem value="">Assign</MenuItem>
                      <MenuItem value="John Doe">John Doe</MenuItem>
                      <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell className={`table-cell ${req.paymentStatus === "Paid" ? "payment-paid" : "payment-unpaid"}`}>
                    {req.paymentStatus}
                  </TableCell>
                  <TableCell className="table-cell">
                    <Button className="cancel-button">Cancel</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ServiceRequests;
