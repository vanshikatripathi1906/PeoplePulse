const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    empId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Employee"],
      default: "Employee",
    },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    experience: { type: String, default: "0 Years" },
    manager: { type: String, default: "—" },
    phone: { type: String, default: "" },
    location: { type: String, default: "HQ" },
    type: { type: String, enum: ["Full-time", "Contract", "Part-time", "Intern"], default: "Full-time" },
    status: { type: String, enum: ["Active", "Pending", "On Leave", "Resigned", "Rejected"], default: "Active" },
    joined: { type: String, default: "Jan 2024" },
    skills: [
      {
        name: { type: String },
        level: { type: Number, min: 1, max: 5 },
      },
    ],
    perf: {
      Technical: { type: Number, default: 8 },
      Communication: { type: Number, default: 8 },
      Leadership: { type: Number, default: 7 },
      "Problem Solving": { type: Number, default: 8 },
      Teamwork: { type: Number, default: 9 },
    },
    salary: {
      gross: { type: Number, default: 50000 },
      tax: { type: Number, default: 6000 },
      pf: { type: Number, default: 2000 },
      bonus: { type: Number, default: 2000 },
      net: { type: Number, default: 44000 },
    },
    birthdayToday: { type: Boolean, default: false },
    attendance: [{ type: String }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
