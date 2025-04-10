const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
  try {
    const email = req.body.email ? req.body.email.trim() : "";
    const password = req.body.password ? req.body.password.trim() : "";
    
    console.log("Login request body:", { email, password });
    
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    console.log("User fetched from DB:", user);

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (user.password !== password) {
      console.log("Password mismatch. Entered:", password, "| Stored:", user.password);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    console.log("Login successful for user:", user.email);
    res.status(200).json({ message: "Login successful", user: { email: user.email, role: user.role } });
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
