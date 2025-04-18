// middleware/auth.js
const jwt = require("jsonwebtoken");
const Technician = require("../models/Technician");

const protectTechnician = async (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const technician = await Technician.findById(decoded.technicianId);
      if (!technician) return res.status(404).json({ message: "Technician not found" });
      req.technician = technician;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
  
module.exports = { protectTechnician };
