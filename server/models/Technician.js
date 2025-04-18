const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  skills: { type: [String], required: true },
  experience: { type: Number, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

// 🔥 Important fix here:
const Technician = mongoose.models.Technician || mongoose.model('Technician', technicianSchema);

module.exports = Technician;
