const express = require("express");
const router = express.Router();
const { getLeaveRequests, createLeaveRequest, updateLeaveStatus } = require("../controllers/leaveController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router
  .route("/")
  .get(protect, getLeaveRequests)
  .post(protect, createLeaveRequest);

router
  .route("/:id/status")
  .patch(protect, authorizeRoles("Admin", "Manager"), updateLeaveStatus);

module.exports = router;
