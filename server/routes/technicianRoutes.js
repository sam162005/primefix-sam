const express = require('express');
const router = express.Router();
const Technician = require('../models/Technician');
const bcrypt = require('bcryptjs');

// Technician Registration
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
      skills: skills.split(',').map(skill => skill.trim()), // Handling skills as an array
      experience,
      address,
      status: "Pending", // Default status is Pending
    });

    await newTechnician.save();

    res.status(201).json({ message: "Technician registration submitted successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Technician Login
router.post("/login", async (req, res) => {
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

module.exports = router;
