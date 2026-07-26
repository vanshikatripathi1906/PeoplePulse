const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "peoplepulse_secret_key_123", {
    expiresIn: "30d",
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });

    // For demo convenience, if role requested and password provided, match or mock auth
    if (!user) {
      user = await User.findOne({ role: role || "Employee" });
    }

    if (user && (await user.matchPassword(password || "password123"))) {
      res.json({
        _id: user._id,
        empId: user.empId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        token: generateToken(user._id),
      });
    } else if (user) {
      // Fallback response for easy demo login
      res.json({
        _id: user._id,
        empId: user.empId,
        name: user.name,
        email: user.email,
        role: role || user.role,
        department: user.department,
        designation: user.designation,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = { loginUser, getUserProfile };
