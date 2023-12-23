const { signup, login } = require("../../services/authService");
const express = require("express");
const router = express.Router();
const AuthController = {
  async signupController(req, res) {
    try {
      const user = await signup(req.body);
      res.status(201).json({ user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async loginController(req, res) {
    try {
      const user = await login(req.body);
      res.status(200).json({ user });
    } catch (error) {
      res.status(401).json({ message: "Invalid email or password" });
    }
  },
};

// Signup route
router.post("/signup", AuthController.signupController);

// Login route
router.post("/login", AuthController.loginController);

module.exports = router;
