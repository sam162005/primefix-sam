const express = require('express');
const router = express.Router();
const Technician = require('../models/Technician');
const bcrypt = require('bcryptjs');

// Technician Registration (Public)
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, skills, experience, address } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !skills || !experience || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if technician already exists
    const existingTechnician = await Technician.findOne({ email });
    if (existingTechnician) {
      return res.status(400).json({ error: "Technician with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new technician
    const newTechnician = new Technician({
      name,
      email,
      phone,
      password: hashedPassword,
      skills: skills.split(',').map(skill => skill.trim()), // Handling skills as array
      experience,
      address,
      status: "Pending", // Default is Pending
    });

    await newTechnician.save();

    res.status(201).json({ message: "Technician registration submitted successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Technician Login (Public)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const technician = await Technician.findOne({ email });
    if (!technician) {
      return res.status(404).json({ error: "Technician not found" });
    }

    if (technician.status !== "Approved") {
      return res.status(403).json({ error: "Technician account is not approved yet" });
    }

    const isMatch = await bcrypt.compare(password, technician.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      technician: {
        id: technician._id,
        name: technician.name,
        email: technician.email,
      }
    });

  } catch (error) {
    console.error("Technician Login Error:", error.message);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// ========== ADMIN FEATURES ==========

// Get all pending technician requests
router.get('/requests', async (req, res) => {
  try {
    const pendingTechnicians = await Technician.find({ status: "Pending" });
    res.json(pendingTechnicians);
  } catch (error) {
    console.error("Fetching Pending Requests Error:", error);
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

// Get all approved technicians (for management)
router.get('/approved', async (req, res) => {
  try {
    const approvedTechnicians = await Technician.find({ status: "Approved" });
    res.json(approvedTechnicians);
  } catch (error) {
    console.error("Fetching Approved Technicians Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get all technicians (optional: for full management page)
router.get('/all', async (req, res) => {
  try {
    const allTechnicians = await Technician.find();
    res.json(allTechnicians);
  } catch (error) {
    console.error("Fetching All Technicians Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Update technician status (active/inactive/blacklisted)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const technician = await Technician.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!technician) {
      return res.status(404).json({ error: "Technician not found" });
    }
    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Delete technician
router.delete('/:id', async (req, res) => {
  try {
    const technician = await Technician.findByIdAndDelete(req.params.id);
    if (!technician) {
      return res.status(404).json({ error: "Technician not found" });
    }
    res.json({ message: "Technician removed successfully" });
  } catch (error) {
    console.error("Delete Technician Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
