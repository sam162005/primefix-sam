const express = require('express');
const router = express.Router();
const Technician = require('../models/Technician');

// Get all pending technician requests
router.get('/requests', async (req, res) => {
  try {
    const pendingTechnicians = await Technician.find({ status: "Pending" });
    res.json(pendingTechnicians);
  } catch (error) {
    console.error("Fetching Requests Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Approve technician
router.put('/approve/:id', async (req, res) => {
  try {
    const technicianId = req.params.id;
    const updatedTechnician = await Technician.findByIdAndUpdate(
      technicianId,
      { status: "Approved" },
      { new: true }
    );
    if (!updatedTechnician) {
      return res.status(404).json({ error: "Technician not found" });
    }
    res.json({ message: "Technician approved successfully" });
  } catch (error) {
    console.error("Approve Technician Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Reject technician
router.put('/reject/:id', async (req, res) => {
  try {
    const technicianId = req.params.id;
    const updatedTechnician = await Technician.findByIdAndUpdate(
      technicianId,
      { status: "Rejected" },
      { new: true }
    );
    if (!updatedTechnician) {
      return res.status(404).json({ error: "Technician not found" });
    }
    res.json({ message: "Technician rejected successfully" });
  } catch (error) {
    console.error("Reject Technician Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// (Optional) Get all approved technicians (for admin management)
router.get('/approved', async (req, res) => {
  try {
    const approvedTechnicians = await Technician.find({ status: "Approved" });
    res.json(approvedTechnicians);
  } catch (error) {
    console.error("Fetching Approved Technicians Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
