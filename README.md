# PeoplePulse — Employee Lifecycle & HR Management System

<p align="center">
  <img src="frontend/public/brand-icon.svg" width="80" height="80" alt="PeoplePulse Logo" />
</p>

<p align="center">
  <b>A Full-Stack MERN Application for End-to-End Workforce Engagement & HR Management</b>
</p>

<p align="center">
  <a href="#technology-stack">Tech Stack</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#user-roles--permissions">User Roles</a> •
  <a href="#installation--setup">Installation</a> •
  <a href="#api-endpoints">API Endpoints</a> •
  <a href="#folder-structure">Project Structure</a>
</p>

---

## Overview

**PeoplePulse** is a complete, enterprise-grade Employee Lifecycle & HR Portal built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). 

It simulates the complete end-to-end workforce workflow: **Hiring, Onboarding, Real-World Attendance, Leave Management, Payroll Approval, Performance Ratings, Task Boards, Company Asset Tracking, Meeting Room Reservations, and Resignation.**

---

## Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Modern CSS System, Dark Obsidian Theme, Glassmorphism
- **Typography**: Inter, Space Grotesk, IBM Plex Mono
- **Icons**: Lucide React Icons
- **Data Visualization**: Recharts (Radar charts, Line trends)

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs Password Hashing
- **Security**: CORS, Role-Based Access Control (RBAC) Middleware

---

## User Roles & Permissions

PeoplePulse supports three distinct user roles with strict role-based access control:

| Permission / Action | Admin | Manager | Employee |
| :--- | :---: | :---: | :---: |
| **Add / Edit Employee Details** | Allowed | Not Allowed | Self Only |
| **Delete Employees** | Allowed | Not Allowed | Not Allowed |
| **Create Departments** | Allowed | Not Allowed | Not Allowed |
| **Assign Tasks** | Allowed | Allowed | Not Allowed |
| **Approve Leave Applications** | Allowed | Allowed (Team) | Apply Only |
| **Edit Performance Ratings & Summaries** | Allowed | Allowed | View Only |
| **Mark Daily Attendance (Check-in/Out)** | Allowed | Allowed | Allowed |
| **Download Salary Slips (PDF/Blob)** | Allowed (All) | Not Allowed | Self Only |
| **Company Asset Tracking & Room Reservation** | Allowed | Allowed | Allowed |

---

## Key Features

- **JWT Authentication & Role Modes**: Secure login with JWT access tokens and quick role-switching demo mode.
- **Obsidian Dark Dashboard**: Sleek dark UI design with customizable responsive layout.
- **Dynamic Attendance Calendar**: Real-world date synchronization with live check-in/out timestamps and automatic calendar cell marking.
- **Kanban Task Board**: Manager-only task creation with priority tags, deadlines, and drag-and-drop column transitions.
- **Performance Review Radar Charts**: Interactive skill evaluation radar charts with manager authorization to edit rating scores and written performance summaries.
- **Company Asset Management**: Hardware inventory tracking for assigned laptops, monitors, mice, and access cards.
- **Meeting Room Reservation**: Conference room booking system with time-slot selection and availability tracking.
- **Salary Slip Generation**: One-click download for formatted salary slip files detailing gross earnings, tax, provident fund, and net pay.
- **AI Skill Search**: Natural language resume skill matching and candidate ranking engine.

---

## Folder Structure

```
PeoplePulse/
├── backend/                  # Express.js & MongoDB Backend
│   ├── config/
│   │   └── db.js             # Mongoose MongoDB Connection
│   ├── controllers/          # Business logic controllers
│   ├── middleware/           # Auth & Role RBAC Middleware
│   ├── models/               # MongoDB Mongoose Schemas (User, Task, Leave, Asset, etc.)
│   ├── routes/               # Express API Route definitions
│   ├── utils/
│   │   └── seedData.js       # Database Seeding script
│   └── server.js             # Entry Point Express Server
│
├── frontend/                 # Vite + React Frontend
│   ├── public/               # Favicon & SVG Assets
│   └── src/
│       ├── components/
│       │   ├── common/       # Cards, Badges, Pills, Section Titles
│       │   ├── layout/       # Sidebar & Topbar Search Overlay
│       │   └── modules/      # Dashboard, Directory, Attendance, Tasks, Performance, Payroll, etc.
│       ├── context/          # AuthContext & ThemeContext
│       ├── pages/            # LoginPage & DashboardPage
│       ├── services/         # Axios API Client & Endpoints
│       ├── styles/           # Global CSS variables & design system
│       ├── App.jsx
│       └── main.jsx
└── README.md
```

---

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local Community Edition or MongoDB Atlas Connection string)

### 1. Clone the Repository
```bash
git clone https://github.com/vanshikatripathi1906/PeoplePulse.git
cd PeoplePulse
```

---

### 2. Setup & Run Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# (Optional) Seed database with mock workforce data
npm run seed

# Start Express Backend Server
npm run dev
```
> The backend server will start at http://localhost:5000

---

### 3. Setup & Run Frontend
Open a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite React Development Server
npm run dev
```
> The frontend application will start at http://localhost:5173

---

## API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticates user & returns JWT Token | Public |
| `GET` | `/api/employees` | Fetches all workspace employees | Admin / Manager |
| `PUT` | `/api/employees/:id` | Updates employee details | Admin / Owner |
| `GET` | `/api/departments` | Lists all company departments | All Roles |
| `POST` | `/api/leave/apply` | Submits new leave application | Employee |
| `PUT` | `/api/leave/approve/:id` | Approves / rejects leave request | Manager / Admin |
| `POST` | `/api/tasks/create` | Creates & assigns a new task | Manager / Admin |
| `PUT` | `/api/tasks/status/:id` | Updates task Kanban column status | Assigned User |

---

## License

Distributed under the **MIT License**. See `LICENSE` for more information.

<p align="center">
  Developed by Vanshika Tripathi
</p>
