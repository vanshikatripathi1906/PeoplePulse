const User = require("../models/User");

const getEmployees = async (req, res) => {
  try {
    const { department, search } = req.query;
    let query = {};

    if (department && department !== "All") {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { empId: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
      ];
    }

    const employees = await User.find(query).select("-password");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select("-password");
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { empId, name, email, password, role, designation, department, experience, manager } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { empId }] });

    if (userExists) {
      return res.status(400).json({ message: "Employee with email or EmpID already exists" });
    }

    const employee = await User.create({
      empId,
      name,
      email,
      password: password || "password123",
      role: role || "Employee",
      designation,
      department,
      experience: experience || "0 Years",
      manager: manager || "—",
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (employee) {
      await employee.deleteOne();
      res.json({ message: "Employee removed successfully" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEmployees, getEmployeeById, createEmployee, deleteEmployee };
