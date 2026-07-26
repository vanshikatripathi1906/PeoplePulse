const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const board = {
      "To Do": tasks.filter((t) => t.status === "To Do"),
      "In Progress": tasks.filter((t) => t.status === "In Progress"),
      Review: tasks.filter((t) => t.status === "Review"),
      Completed: tasks.filter((t) => t.status === "Completed"),
    };
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, priority, deadline, assignee, status } = req.body;
    const task = await Task.create({
      title,
      priority: priority || "Medium",
      deadline,
      assignee,
      status: status || "To Do",
      createdBy: req.user ? req.user.name : "Admin",
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (task) {
      task.status = status;
      await task.save();
      res.json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTaskStatus };
