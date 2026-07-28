const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  getPendingUsers,
  approveUser,
  rejectUser,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/pending", getPendingUsers);
router.patch("/approve/:id", approveUser);
router.patch("/reject/:id", rejectUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;
