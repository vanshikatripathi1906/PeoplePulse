const User = require("../models/User");

const getNetworkHierarchy = async (req, res) => {
  try {
    const admin = await User.findOne({ role: "Admin" }).select("-password");
    const managers = await User.find({ role: "Manager" }).select("-password");
    const employees = await User.find({ role: "Employee" }).select("-password");

    const defaultManagers = [
      { name: "Rahul Sharma", designation: "Senior Engineering Manager", department: "Engineering", email: "managerpeoplepulse@gmail.com" },
      { name: "Priya Nair", designation: "Product Head", department: "Product", email: "priya.nair@peoplepulse.co" },
      { name: "Sneha Gupta", designation: "HR Director", department: "HR", email: "sneha.gupta@peoplepulse.co" },
      { name: "Rohan Kapoor", designation: "Finance Director", department: "Finance", email: "rohan.kapoor@peoplepulse.co" },
      { name: "Ananya Sen", designation: "Marketing Director", department: "Marketing", email: "ananya.sen@peoplepulse.co" },
    ];

    const activeManagers = managers.length >= 5 ? managers : defaultManagers;

    const departmentNetwork = activeManagers.map((mgr) => {
      const deptEmployees = employees.filter((emp) => emp.department === mgr.department);
      return {
        department: mgr.department,
        manager: mgr,
        reportingEmployees: deptEmployees,
        teamCount: deptEmployees.length,
      };
    });

    res.json({
      success: true,
      executiveHead: admin || {
        name: "Aman Verma",
        role: "Admin",
        designation: "System Administrator & Head",
        email: "adminpeoplepulse@gmail.com",
      },
      network: departmentNetwork,
      totalNodes: 1 + activeManagers.length + employees.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNetworkHierarchy };
