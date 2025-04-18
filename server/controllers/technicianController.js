const Technician = require("../models/Technician");

// Register Technician
exports.registerTechnician = async (req, res) => {
  const { name, email, phone, password, skills, experience, address } = req.body;

  try {
    const exists = await Technician.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const technician = new Technician({
      name, email, phone, password, skills, experience, address,
      status: "Pending",
    });

    await technician.save();
    res.status(201).json({ message: "Registration submitted for approval." });
  } catch (error) {
    res.status(500).json({ message: "Error registering technician", error });
  }
};

// Technician Login
exports.loginTechnician = async (req, res) => {
  const { email, password } = req.body;

  try {
    const technician = await Technician.findOne({ email });
    if (!technician) return res.status(404).json({ message: "Technician not found" });
    if (technician.password !== password) return res.status(401).json({ message: "Invalid password" });
    if (technician.status !== "Approved") return res.status(403).json({ message: "Not approved by admin" });

    res.status(200).json({ message: "Login successful", technician });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

// Get All Pending Technicians
exports.getPendingTechnicians = async (req, res) => {
    try {
      const pendingTechs = await Technician.find({ status: "Pending" });
      console.log("Pending Technicians:", pendingTechs);  // Log the technicians
      res.status(200).json(pendingTechs);
    } catch (error) {
      console.error("Error fetching technicians", error);
      res.status(500).json({ message: "Error fetching technicians", error });
    }
  };
  

// Approve Technician
exports.approveTechnician = async (req, res) => {
  try {
    await Technician.findByIdAndUpdate(req.params.id, { status: "Approved" });
    res.status(200).json({ message: "Technician approved" });
  } catch (error) {
    res.status(500).json({ message: "Error approving technician", error });
  }
};
