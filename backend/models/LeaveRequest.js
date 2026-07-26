const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    employee: { type: String, required: true }, // Name or EmpId
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: ["Casual", "Medical", "Earned", "Maternity", "Paternity", "Unpaid"],
      default: "Casual",
    },
    days: { type: Number, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
