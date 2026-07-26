const express = require("express");
const router = express.Router();
const { getDepartments, createDepartment } = require("../controllers/departmentController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router
  .route("/")
  .get(protect, getDepartments)
  .post(protect, authorizeRoles("Admin"), createDepartment);

module.exports = router;
