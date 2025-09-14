const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findByUsername(username);
    if (!admin) return res.status(400).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register (Create Admin)
exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    // cek kalau username sudah ada
    const existingAdmin = await Admin.findByUsername(username);
    if (existingAdmin) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // simpan ke database
    const newAdmin = await Admin.create(username, hashedPassword);

    res.status(201).json({
      message: "Admin registered successfully",
      admin: { id: newAdmin.id, username: newAdmin.username },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
