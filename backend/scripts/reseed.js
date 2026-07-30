const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const dns = require("dns");

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

dotenv.config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const Department = require("../models/Department");
const { EMPLOYEES_SEED, DEPARTMENTS_SEED } = require("../utils/seedData");

const reseed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("Connected cleanly to MongoDB Atlas!");

    console.log("Clearing existing User and Department collections...");
    await User.deleteMany({});
    await Department.deleteMany({});

    console.log(`Inserting ${EMPLOYEES_SEED.length} employees (5 managers + 10 employees per department) into MongoDB Atlas...`);
    await User.insertMany(EMPLOYEES_SEED);

    console.log(`Inserting ${DEPARTMENTS_SEED.length} departments into MongoDB Atlas...`);
    await Department.insertMany(DEPARTMENTS_SEED);

    console.log("✅ SUCCESS! MongoDB Atlas populated with 5 Managers & 10 Employees per Department!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Reseed error:", err);
    process.exit(1);
  }
};

reseed();
