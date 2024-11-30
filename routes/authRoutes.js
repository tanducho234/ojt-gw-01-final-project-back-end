// routes/auth.js
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Registration failed
 */
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

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Registration failed
 */
router.post("/register", async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ email, password: hashedPassword, fullName });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: "Registration failed", error });
  }
});

// Đăng nhập người dùng
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: tanducho234@gmail.com
 *               password:
 *                 type: string
 *                 example: 123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
    expiresIn: "1d",
  });
  res.json({ token, role: user.role });
});

// Route chỉ dành cho admin
/**
 * @swagger
 * /api/auth/admin:
 *   get:
 *     summary: Admin only route
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message for admin
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/admin", authenticate, authorize(["admin"]), (req, res) => {
  res.json({ message: "Welcome, admin!" });
});

// Route dành cho user và admin
/**
 * @swagger
 * /api/auth/user:
 *   get:
 *     summary: User and admin route
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message for user
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/user", authenticate, authorize(["user", "admin"]), (req, res) => {
  res.json({ message: "Welcome, user!" });
});

// Check valid JWT token route
/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verify JWT token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid or expired token
 */
router.get("/verify", authenticate, (req, res) => {
  try {
    // Token is already verified by authenticate middleware
    // Just return success response
    res.status(200).json({
      valid: true,
      message: "Token is valid",
      user: {
        id: req.user.id,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      message: "Invalid or expired token",
    });
  }
});

//get userprofile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
});
//post userprofile
router.post("/profile", authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Lấy ID người dùng từ JWT
    const { fullName, phoneNumber, gender, birthDate, address } = req.body;

    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Cập nhật các trường thông tin
    user.fullName = fullName || user.fullName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.gender = gender || user.gender;
    user.birthDate = birthDate || user.birthDate;
    user.address = address || user.address;

    // Lưu lại thay đổi
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
});
//change password route
router.post("/change-password", authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Lấy ID người dùng từ JWT
    const { currentPassword, newPassword } = req.body;

    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
});

module.exports = router;
