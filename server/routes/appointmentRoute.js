const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
// POST /api/appointments
router.post('/', async (req, res) => {
    try {
      const { services, date, total, address } = req.body;
  
      const newAppointment = new Appointment({
        services,
        date: new Date(date),
        total,
        address
      });
  
      await newAppointment.save();
      res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
    } catch (error) {
      res.status(500).json({ error: 'Failed to book appointment' });
    }
  });
  
module.exports = router;