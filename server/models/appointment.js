const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  services: [
    {
      id: Number,
      name: String,
      price: Number,
      time: String,
      image: String,
    }
  ],
  date: Date,
  total: Number,
  address: String,
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' }, // Reference to the Technician model
  status: { type: String, default: 'Pending' } // Status such as "Pending", "In Progress", or "Completed"
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
