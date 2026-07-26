const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    deadline: { type: String, required: true },
    assignee: { type: String, required: true },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Review", "Completed"],
      default: "To Do",
    },
    createdBy: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
