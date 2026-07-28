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
  {
    empId: "EMP-1001",
    name: "Aman Verma",
    email: "aman.verma@peoplepulse.co",
    password: "password123",
    role: "Admin",
    designation: "Engineering Head",
    department: "Engineering",
    experience: "9 Years",
    manager: "—",
    phone: "+91 98200 11234",
    location: "Indore HQ",
    type: "Full-time",
    status: "Active",
    joined: "Jan 2018",
  },
  {
    empId: "EMP-1002",
    name: "Rahul Sharma",
    email: "rahul.sharma@peoplepulse.co",
    password: "password123",
    role: "Manager",
    designation: "Senior Engineering Manager",
    department: "Engineering",
    experience: "8 Years",
    manager: "Aman Verma",
    phone: "+91 99770 44120",
    location: "Indore HQ",
    type: "Full-time",
    status: "Active",
    joined: "Jul 2020",
  },
  {
    empId: "EMP-1003",
    name: "Priya Nair",
    email: "priya.nair@peoplepulse.co",
    password: "password123",
    role: "Manager",
    designation: "Product Head",
    department: "Product",
    experience: "7 Years",
    manager: "Aman Verma",
    phone: "+91 96541 22310",
    location: "Indore HQ",
    type: "Full-time",
    status: "Active",
    joined: "Apr 2017",
  },
  {
    empId: "EMP-1004",
    name: "Vanshika Tripathi",
    email: "vanshikapeoplepulse@gmail.com",
    password: "password123",
    role: "Employee",
    designation: "Frontend Developer",
    department: "Engineering",
    experience: "2 Years",
    manager: "Rahul Sharma",
    phone: "+91 90212 55810",
    location: "Indore HQ",
    type: "Full-time",
    status: "Active",
    joined: "Mar 2024",
  },
  {
    empId: "EMP-1005",
    name: "Aditi Tripathi",
    email: "aditi.t@peoplepulse.co",
    password: "password123",
    role: "Employee",
    designation: "Backend Developer",
    department: "Engineering",
    experience: "5 Years",
    manager: "Rahul Sharma",
    phone: "+91 98330 93380",
    location: "Indore HQ",
    type: "Full-time",
    status: "Active",
    joined: "Jan 2021",
  },
  {
    empId: "EMP-1006",
    name: "Rohan Gupta",
    email: "rohan.gupta@peoplepulse.co",
    password: "password123",
    role: "Employee",
    designation: "Full Stack Developer",
    department: "Engineering",
    experience: "4 Years",
    manager: "Rahul Sharma",
    phone: "+91 98210 44321",
    location: "Pune Office",
    type: "Full-time",
    status: "Active",
    joined: "Aug 2022",
  },
  {
    empId: "EMP-1007",
    name: "Neha Singh",
    email: "neha.singh@peoplepulse.co",
    password: "password123",
    role: "Employee",
    designation: "UI/UX Designer",
    department: "Design",
    experience: "3 Years",
    manager: "Priya Nair",
    phone: "+91 97110 55432",
    location: "Remote",
    type: "Full-time",
    status: "Active",
    joined: "May 2023",
  },
  {
    empId: "EMP-1008",
    name: "Karan Malhotra",
    email: "karan.m@peoplepulse.co",
    password: "password123",
    role: "Employee",
    designation: "QA Lead",
    department: "Engineering",
    experience: "3.5 Years",
    manager: "Rahul Sharma",
    phone: "+91 97531 88120",
    location: "Pune Office",
    type: "Contract",
    status: "Active",
    joined: "Feb 2023",
  },
  {
    empId: "EMP-1009",
    name: "Sneha Patel",
    email: "sneha.patel@peoplepulse.co",
    password: "password123",
    role: "Employee",
    designation: "DevOps Specialist",
    department: "Engineering",
    experience: "5 Years",
    manager: "Rahul Sharma",
    phone: "+91 98450 11982",
    location: "Indore HQ",
    type: "Full-time",
    status: "Active",
    joined: "Oct 2021",
  },
  {
    empId: "EMP-1010",
    name: "Arjun Mehta",
    email: "arjun.mehta@peoplepulse.co",
    password: "password123",
    role: "Employee",
    designation: "Data Analytics Engineer",
    department: "Analytics",
    experience: "4 Years",
    manager: "Priya Nair",
    phone: "+91 98760 33412",
    location: "Indore HQ",
    type: "Full-time",
    status: "Active",
    joined: "Nov 2022",
  },
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
];

const LEAVES_SEED = [
  { employee: "Vanshika Tripathi", type: "Medical", days: 3, start: "28 Jul", end: "30 Jul", reason: "Medical leave", status: "Approved" },
  { employee: "Devansh Patil", type: "Casual", days: 1, start: "26 Jul", end: "26 Jul", reason: "Personal work", status: "Pending" },
  { employee: "Ishita Rao", type: "Earned", days: 5, start: "01 Aug", end: "05 Aug", reason: "Family trip", status: "Approved" },
];

const TASKS_SEED = [
  { title: "Design System Tokens", priority: "High", assignedDate: "20 Jul", deadline: "28 Jul", assignee: "Vanshika Tripathi" },
  { title: "Refactor API Gateway", priority: "Medium", assignedDate: "22 Jul", deadline: "30 Jul", assignee: "Aditi Tripathi" },
];

module.exports = {
  EMPLOYEES_SEED,
  DEPARTMENTS_SEED,
  LEAVES_SEED,
  TASKS_SEED,
};
