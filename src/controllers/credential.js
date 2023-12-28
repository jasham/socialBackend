const { saveCredential } = require("../services/credential");
const express = require("express");
const router = express.Router();

const CredentialController = {
  async test(req, res) {
    try {
      res.status(201).json("api calling");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async save(req, res) {
    try {
      console.log("req", req.user);
      const user = {
        accessToken: req.user.accessToken,
        userId: "65890894d98e4a4e9c79959b",
      };

      const saveRes = await saveCredential(user);
      console.log("saveRes=", saveRes)
      res.redirect("http://localhost:3000/feeds");
      //res.status(201).json(saveRes);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

router.get("/test", CredentialController.test);
router.get("/", CredentialController.save);

module.exports = router;
