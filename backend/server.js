const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const { EMPLOYEES_SEED } = require("./utils/seedData");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB().then(async () => {
  try {
    const userCount = await User.countDocuments({});
    if (userCount === 0) {
      console.log("Database empty. Seeding initial employee records into MongoDB...");
      await User.insertMany(EMPLOYEES_SEED);
      console.log(`Seeded ${EMPLOYEES_SEED.length} employees into MongoDB.`);
    }
  } catch (err) {
    console.log("Could not auto-seed DB:", err.message);
  }
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/leave", require("./routes/leaveRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/network", require("./routes/networkRoutes"));

app.get("/api/analytics", (req, res) => {
  res.json({
    hiringTrend: [
      { month: "Feb", hires: 18 }, { month: "Mar", hires: 25 }, { month: "Apr", hires: 14 },
      { month: "May", hires: 21 }, { month: "Jun", hires: 16 }, { month: "Jul", hires: 18 },
    ],
    leavePie: [
      { name: "Medical", value: 40 }, { name: "Casual", value: 30 },
      { name: "Earned", value: 20 }, { name: "Others", value: 10 },
    ],
    attendanceTrend: [
      { week: "W1", rate: 98 }, { week: "W2", rate: 96 }, { week: "W3", rate: 95 }, { week: "W4", rate: 97 },
    ],
  });
});

app.get("/", (req, res) => {
  res.send("PeoplePulse API server is up and running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
