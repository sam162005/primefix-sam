// routes/EarningsRoute.js
const express = require("express");
const router = express.Router();
const Earnings = require("../models/Earnings"); // create this schema

// POST: Add a new earning entry
router.post("/add", async (req, res) => {
  try {
    const { technicianId, job, amount, date } = req.body;
    const newEntry = new Earnings({ technicianId, job, amount, date });
    const savedEntry = await newEntry.save();
    res.status(200).json(savedEntry);
  } catch (error) {
    console.error("Error saving earning:", error);
    res.status(500).json({ error: "Server error while saving earnings." });
  }
});

// GET: Fetch earnings for a technician
router.get("/history/:technicianId", async (req, res) => {
  try {
    const entries = await Earnings.find({ technicianId: req.params.technicianId }).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Server error while fetching history." });
  }
});

module.exports = router;
