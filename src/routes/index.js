const { Router } = require("express");
const { main } = require("../helper/db");
var router = Router();

router.use("/api/v1", main, require("../controllers/authController"));
router.use("/api/v1/credential", main, require("../controllers/credential"));

module.exports = router;
