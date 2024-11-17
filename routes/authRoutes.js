// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.JWT_SECRET;
// Đăng ký người dùng
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({ email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: "Registration failed", error });
  }
});

// Đăng nhập người dùng
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
    expiresIn: "1d",
  });
  res.json({ token });
});

// Route chỉ dành cho admin
router.get("/admin", authenticate, authorize(["admin"]), (req, res) => {
  res.json({ message: "Welcome, admin!" });
});

// Route dành cho user và admin
router.get("/user", authenticate, authorize(["user", "admin"]), (req, res) => {
  res.json({ message: "Welcome, user!" });
});

module.exports = router;
