const Department = require("../models/Department");

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, head, count, avgExp, projects } = req.body;
    const department = await Department.create({ name, head, count, avgExp, projects });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDepartments, createDepartment };
