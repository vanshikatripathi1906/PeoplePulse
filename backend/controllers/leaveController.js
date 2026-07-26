const LeaveRequest = require("../models/LeaveRequest");

const getLeaveRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({}).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLeaveRequest = async (req, res) => {
  try {
    const { employee, type, days, start, end, reason } = req.body;
    const leave = await LeaveRequest.create({
      employee: employee || (req.user ? req.user.name : "Employee"),
      type,
      days,
      start,
      end,
      reason,
      status: "Pending",
    });
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await LeaveRequest.findById(req.params.id);
    if (leave) {
      leave.status = status;
      await leave.save();
      res.json(leave);
    } else {
      res.status(404).json({ message: "Leave request not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaveRequests, createLeaveRequest, updateLeaveStatus };
