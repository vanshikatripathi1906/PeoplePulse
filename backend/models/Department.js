const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    head: { type: String, default: "—" },
    count: { type: Number, default: 0 },
    avgExp: { type: String, default: "0 Years" },
    projects: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
