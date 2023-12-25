const { signup, login } = require("../../services/authService");
const express = require("express");
const router = express.Router();

const AuthController = {
  async test(req, res) {
    try {
      const user = await signup(req.body);
      res.status(201).json("api calling");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async signupController(req, res) {
    try {
      const user = await signup(req.body);
      // return { user: req.body }
      res.status(201).json({ user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async loginController(req, res) {
    try {
      const user = await login(req.body);
      res.status(200).json({ token: user.token });
    } catch (error) {
      res.status(401).json({ message: "Invalid email or password" });
    }
  },
};

router.get("/test", AuthController.test);
// Signup route
router.post("/signup", AuthController.signupController);

// Login route
router.post("/login", AuthController.loginController);

module.exports = router;
