const User = require("../models/User");

const getEmployees = async (req, res) => {
  try {
    const { department, search } = req.query;
    let query = { status: { $ne: "Rejected" } };

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
    const { empId, name, email, password, role, designation, department, experience, manager, phone, location } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { empId }] });

    if (userExists) {
      return res.status(400).json({ message: "Employee with email or EmpID already exists" });
    }

    const count = await User.countDocuments({});
    const generatedEmpId = empId || `EMP-${1001 + count}`;

    const employee = await User.create({
      empId: generatedEmpId,
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@peoplepulse.co`,
      password: password || "password123",
      role: role || "Employee",
      designation: designation || "Software Associate",
      department: department || "Engineering",
      experience: experience || "1 Year",
      manager: manager || "Aman Verma",
      phone: phone || "+91 98000 12345",
      location: location || "Indore HQ",
      status: "Active",
      joined: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    Object.assign(employee, req.body);
    const updated = await employee.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findOne({ $or: [{ _id: req.params.id }, { empId: req.params.id }] });
    if (employee) {
      await employee.deleteOne();
      res.json({ message: "Employee removed successfully from MongoDB Atlas" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee };
