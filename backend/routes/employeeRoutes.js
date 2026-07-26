const express = require("express");
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router
  .route("/")
  .get(protect, getEmployees)
  .post(protect, authorizeRoles("Admin"), createEmployee);

router
  .route("/:id")
  .get(protect, getEmployeeById)
  .delete(protect, authorizeRoles("Admin"), deleteEmployee);

module.exports = router;
