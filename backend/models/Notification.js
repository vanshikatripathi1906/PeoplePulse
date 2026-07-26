const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    time: { type: String, default: "Just now" },
    icon: { type: String, default: "Bell" },
    tone: { type: String, enum: ["good", "warn", "info", "bad"], default: "info" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
