const { saveCredential } = require("../services/credential");
const express = require("express");
const router = express.Router();

const CredentialController = {
  async test(req, res) {
    try {
      console.log("req", req);
      res.status(201).json("api calling");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async save(req, res) {
    try {
      const saveRes = await saveCredential(req.body);
      res.status(201).json(saveRes);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

router.get("/test", CredentialController.test);
router.post("/", CredentialController.save);

module.exports = router;
