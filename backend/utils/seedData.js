const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Department = require("../models/Department");
const LeaveRequest = require("../models/LeaveRequest");
const Task = require("../models/Task");
const Notification = require("../models/Notification");
const connectDB = require("../config/db");

dotenv.config();

function seedAttendance(seed) {
  const arr = [];
  for (let i = 0; i < 28; i++) {
    const v = (seed * (i + 3) * 7) % 23;
    arr.push(v < 15 ? "P" : v < 17 ? "WFH" : v < 19 ? "L" : v < 21 ? "H" : "A");
  }
  return arr;
}

const EMPLOYEES_SEED = [
  { empId: "EMP-1001", name: "Aman Verma", email: "aman.verma@peoplepulse.co", password: "password123", role: "Admin", designation: "Engineering Head", department: "Engineering", experience: "9 Years", manager: "—", phone: "+91 98200 11234", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jan 2018" },
  { empId: "EMP-1004", name: "Vanshika Tripathi", email: "vanshika.t@peoplepulse.co", password: "password123", role: "Employee", designation: "Frontend Developer", department: "Engineering", experience: "2 Years", manager: "Rahul Sharma", phone: "+91 90212 55810", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Mar 2024" },
  { empId: "EMP-1012", name: "Rahul Sharma", email: "rahul.sharma@peoplepulse.co", password: "password123", role: "Manager", designation: "Engineering Manager", department: "Engineering", experience: "6 Years", manager: "Aman Verma", phone: "+91 99770 44120", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jul 2020" },
  { empId: "EMP-1019", name: "Ishita Rao", email: "ishita.rao@peoplepulse.co", password: "password123", role: "Employee", designation: "Backend Developer", department: "Engineering", experience: "3 Years", manager: "Rahul Sharma", phone: "+91 98330 12908", location: "Remote", type: "Full-time", status: "On Leave", joined: "Nov 2022" },
  { empId: "EMP-1023", name: "Devansh Patil", email: "devansh.p@peoplepulse.co", password: "password123", role: "Employee", designation: "QA Engineer", department: "Engineering", experience: "1.5 Years", manager: "Rahul Sharma", phone: "+91 97531 88120", location: "Pune Office", type: "Contract", status: "Active", joined: "Feb 2025" },
  { empId: "EMP-1031", name: "Priya Nair", email: "priya.nair@peoplepulse.co", password: "password123", role: "Manager", designation: "HR Head", department: "HR", experience: "8 Years", manager: "—", phone: "+91 96541 22310", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Apr 2017" },
];

EMPLOYEES_SEED.forEach((e, i) => {
  e.attendance = seedAttendance(i + 1);
  e.skills = [
    { name: "React", level: 3 + (i % 3) },
    { name: "Node.js", level: 2 + (i % 4) },
    { name: "MongoDB", level: 1 + (i % 5) },
    { name: "Communication", level: 3 + ((i + 1) % 3) },
  ];
  e.perf = {
    Technical: 6 + (i % 4),
    Communication: 6 + ((i + 2) % 4),
    Leadership: 5 + ((i + 1) % 5),
    "Problem Solving": 6 + ((i + 3) % 4),
    Teamwork: 7 + (i % 3),
  };
  e.salary = {
    gross: 55000 + i * 2200,
    tax: 6200 + i * 180,
    pf: 2100 + i * 60,
    bonus: 2000 + (i % 4) * 400,
    net: 48700 + i * 1960,
  };
  e.birthdayToday = i === 3 || i === 1;
});

const DEPARTMENTS_SEED = [
  { name: "Engineering", head: "Aman Verma", count: 128, avgExp: "3.5 Years", projects: 18 },
  { name: "HR", head: "Priya Nair", count: 34, avgExp: "4.1 Years", projects: 4 },
  { name: "Finance", head: "Meera Iyer", count: 52, avgExp: "5.2 Years", projects: 6 },
  { name: "Marketing", head: "Arjun Malhotra", count: 61, avgExp: "3.8 Years", projects: 9 },
  { name: "Sales", head: "—", count: 45, avgExp: "2.9 Years", projects: 11 },
  { name: "Operations", head: "Nikhil Bhatt", count: 39, avgExp: "4.6 Years", projects: 5 },
];

const LEAVES_SEED = [
  { employee: "Vanshika Tripathi", type: "Medical", days: 3, start: "28 Jul", end: "30 Jul", reason: "Medical leave", status: "Pending" },
  { employee: "Devansh Patil", type: "Casual", days: 1, start: "26 Jul", end: "26 Jul", reason: "Personal work", status: "Pending" },
  { employee: "Ishita Rao", type: "Earned", days: 5, start: "01 Aug", end: "05 Aug", reason: "Family trip", status: "Approved" },
];

const TASKS_SEED = [
  { title: "Set up CI pipeline", priority: "Medium", deadline: "29 Jul", assignee: "Devansh Patil", status: "To Do" },
  { title: "Backend API for leave module", priority: "High", deadline: "27 Jul", assignee: "Ishita Rao", status: "In Progress" },
  { title: "Build Login Module", priority: "High", deadline: "25 Jul", assignee: "Vanshika Tripathi", status: "Review" },
  { title: "Payroll approval workflow", priority: "High", deadline: "18 Jul", assignee: "Meera Iyer", status: "Completed" },
];

const seedData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Department.deleteMany();
    await LeaveRequest.deleteMany();
    await Task.deleteMany();

    await User.create(EMPLOYEES_SEED);
    await Department.create(DEPARTMENTS_SEED);
    await LeaveRequest.create(LEAVES_SEED);
    await Task.create(TASKS_SEED);

    console.log("Database Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`Error Seeding Data: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = { EMPLOYEES_SEED, DEPARTMENTS_SEED, LEAVES_SEED, TASKS_SEED };
