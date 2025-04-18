require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const app = express();

// Routes
const earningsRoute = require("./routes/EarningsRoute");
const technicianRoutes = require("./routes/technicianRoutes");

// Models
const Technician = require('./models/Technician');

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Routes
app.use("/api/earnings", earningsRoute);

app.use("/api/technician", technicianRoutes);


// ✅ Admin Schema & Model
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
});
const Admin = mongoose.model("Admin", AdminSchema);

// ✅ User Schema & Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully");

    // ✅ Check and Create Admin if Not Exists
    const adminExists = await Admin.findOne({ email: "admin@gmail.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("adminlogin123", 10);
      const newAdmin = new Admin({
        email: "admin@gmail.com",
        password: hashedPassword,
      });
      await newAdmin.save();
      console.log("✅ Default Admin Created: admin@gmail.com / adminlogin123");
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  });

// ✅ Technician Registration Route
app.post("/api/technicians/register", async (req, res) => {
  try {
    const { name, email, phone, password, skills, experience, address } = req.body;

    const existingTech = await Technician.findOne({ email });
    if (existingTech) return res.status(400).json({ error: "Technician already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newTech = new Technician({
      name,
      email,
      phone,
      password: hashedPassword,
      skills,
      experience,
      address,
    });

    await newTech.save();
    res.status(201).json({ message: "Technician registered, waiting for admin approval." });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Admin Approves Technician
app.post("/api/technicians/approve", async (req, res) => {
  const { technicianId } = req.body;

  try {
    const technician = await Technician.findById(technicianId);
    if (!technician) return res.status(404).json({ error: "Technician not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    technician.status = "Approved";
    technician.verificationCode = code;
    await technician.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: technician.email,
      subject: "Technician Verification Code",
      text: `Hi ${technician.name},\n\nYour verification code is: ${code}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Technician approved and verification code sent." });
  } catch (err) {
    console.error("Approval Error:", err);
    res.status(500).json({ error: "Server error during approval" });
  }
});

// ✅ Admin Login Route
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { adminId: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, admin: { email: admin.email, role: admin.role } });
  } catch (error) {
    console.error("❌ Admin Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ User Registration
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ User Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error("❌ User Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
