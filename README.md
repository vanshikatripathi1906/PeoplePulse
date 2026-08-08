# 💼 PeoplePulse — Modern MERN HR & Workforce Management System

![PeoplePulse](https://img.shields.io/badge/Status-Live%20Production-2F8F82?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/Stack-MongoDB%20%7C%20Express%20%7C%20React%20%7C%20Node.js-38BDF8?style=for-the-badge)

> A modern, full-stack Human Resource Management System (HRMS) built with React 18, Node.js, Express, and MongoDB Atlas. Features dynamic Role-Based Access Control (RBAC), workforce attendance tracking, departmental org charts, performance evaluations, and automated meeting notification dispatching.

---

## 🌐 Live Production Links

* 🚀 **Live Web Application (Frontend)**: **[https://people-pulse-pi.vercel.app](https://people-pulse-pi.vercel.app)**
* ⚙️ **REST API Server (Backend)**: **[https://peoplepulse-3q72.onrender.com](https://peoplepulse-3q72.onrender.com)**
* 📁 **GitHub Repository**: **[https://github.com/vanshikatripathi1906/PeoplePulse](https://github.com/vanshikatripathi1906/PeoplePulse)**

---

## 🔐 Demo Credentials for Login

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `adminpeoplepulse@gmail.com` | `admin123` | Full System Control, Directory, Workforce Logs |
| **Manager (Engineering)** | `managerpeoplepulse@gmail.com` | `manager123` | Departmental Team, Performance Rating, Events |
| **Employee** | `vanshikapeoplepulse@gmail.com` | `employee123` | Personal Profile, Daily Check-In, Salary Slips |

---

## ✨ Key Features & Highlights

- **🛡️ Dynamic Role-Based Access Control (RBAC)**: Custom UI and data scoping for Admin, Manager, and Employee accounts.
- **📁 Employee Directory & Hierarchy**: Real-time workforce management synced directly with MongoDB Atlas cloud database.
- **⏱️ Attendance & Daily Punching**: Dynamic check-in/check-out system with automatic compliance rate calculations.
- **📊 Performance Evaluation Matrix**: Interactive technical, communication, and leadership ratings with top performer rankings.
- **💰 Scoped Payroll Management**: Downloadable salary slip text downloads with custom gross/net breakdown.
- **📅 Departmental Event Scheduling**: Meeting scheduler with automatic real-time notification dispatch to target departments.
- **🌳 Unified Organizational Chart**: Clean 3-tier hierarchy visualization across Executive Head, Department Managers, and Employees.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, Lucide Icons, Recharts, Axios, Vanilla CSS Tokens
* **Backend**: Node.js, Express.js, Cors, Dotenv, JWT Authentication
* **Database**: MongoDB Atlas Cloud, Mongoose ODM
* **Deployment**: Vercel (Frontend SPA) + Render (Backend API Service)

---

## 💻 Local Development Setup

```bash
# 1. Clone Repository
git clone https://github.com/vanshikatripathi1906/PeoplePulse.git
cd PeoplePulse

# 2. Setup & Run Backend
cd backend
npm install
npm run dev

# 3. Setup & Run Frontend (In a new terminal)
cd frontend
npm install
npm run dev
```

---

*Developed with ❤️ by Vanshika Tripathi*
