const express = require("express");
const router = express.Router();
const { getNetworkHierarchy } = require("../controllers/networkController");

router.get("/hierarchy", getNetworkHierarchy);
router.get("/", getNetworkHierarchy);

module.exports = router;
