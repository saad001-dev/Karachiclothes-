const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Users file path
const USERS_FILE = path.join(__dirname, "../users.json");

// Helper: Read users
const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // Default admin user if file doesn't exist
    return [
      {
        id: 1,
        email: "admin@karachiclothes.com",
        password: "admin!123",
        name: "Admin",
        role: "admin",
      },
    ];
  }
};

// Helper: Write users
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
};

// ✅ LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const users = readUsers();
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Don't send password in response
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    message: "Login successful",
    user: userWithoutPassword,
  });
});

// ✅ REGISTER (Optional - For adding new admins)
router.post("/register", (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const users = readUsers();

  // Check if email already exists
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  const newUser = {
    id: Date.now(),
    email,
    password,
    name: name || "Admin",
    role: "admin",
  };

  users.push(newUser);
  writeUsers(users);

  const { password: _, ...userWithoutPassword } = newUser;

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: userWithoutPassword,
  });
});

// ✅ UPDATE PASSWORD
router.put("/change-password", (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const users = readUsers();
  const userIndex = users.findIndex((u) => u.email === email);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (users[userIndex].password !== oldPassword) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  users[userIndex].password = newPassword;
  writeUsers(users);

  res.json({
    success: true,
    message: "Password updated successfully",
  });
});

module.exports = router;