const { Router } = require("express");
var router = Router();
//const { main } = require("../helper/db");

router.use("/api/v1", require("../controllers/authController"));
// router.use("/api/v1/category", main, require("../controllers/category"));

module.exports = router;
