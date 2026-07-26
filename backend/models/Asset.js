const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["Laptop", "Monitor", "Mouse", "Access Card", "Phone", "Other"], required: true },
    serialNumber: { type: String, required: true, unique: true },
    assignedTo: { type: String, default: "Unassigned" },
    issueDate: { type: String },
    returnDate: { type: String },
    status: { type: String, enum: ["Assigned", "Available", "Under Maintenance"], default: "Available" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", assetSchema);
