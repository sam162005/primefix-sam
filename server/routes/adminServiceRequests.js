const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment'); // Appointment model
const ServiceRequest = require('../models/ServiceRequest');


// 1. Get all service requests (appointments)
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// 2. Get appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json({ appointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

// 3. Update appointment status (e.g., "In Progress", "Completed")
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body; // Status such as "In Progress" or "Completed"
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    appointment.status = status;
    await appointment.save();
    res.status(200).json({ message: 'Appointment status updated successfully', appointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// 4. Assign technician to an appointment
router.patch('/:id/assignTechnician', async (req, res) => {
  const { technicianId } = req.body; // Technician ID to assign to the appointment
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    appointment.technician = technicianId; // Assuming `technician` field exists in the appointment schema
    await appointment.save();
    res.status(200).json({ message: 'Technician assigned successfully', appointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign technician' });
  }
});
router.get("/serviceRequests", async (req, res) => {
    try {
      const serviceRequests = await ServiceRequest.find();
      res.status(200).json(serviceRequests);
    } catch (error) {
      res.status(500).json({ message: "Error fetching service requests", error });
    }
  });
module.exports = router;
