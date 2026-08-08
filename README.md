# PeoplePulse — HR & Workforce Management System

Live Demo: [https://people-pulse-pi.vercel.app](https://people-pulse-pi.vercel.app)  
Backend API: [https://peoplepulse-3q72.onrender.com](https://peoplepulse-3q72.onrender.com)

PeoplePulse is a full-stack HR management web app built using the MERN stack. It helps manage workforce directory, employee attendance, department team structures, performance evaluations, and salary slips with role-based access for Admin, Managers, and Employees.

---

## Access Control & Security

The portal uses authentic email and password authentication. Users can sign in using registered Admin, Manager, or Employee accounts, or request new account access via the Sign Up form.

---

## Features

- **Role-Based Access (Admin / Manager / Employee)**: Custom dashboard views and permissions for each role.
- **Employee Directory**: Manage employee profiles, departments, and designations.
- **Attendance Tracking**: Daily check-in and check-out with attendance compliance metrics.
- **Performance Evaluation**: Technical, communication, and leadership rating matrix.
- **Payroll**: Scoped salary breakdown and downloadable salary slips.
- **Events & Notifications**: Schedule meetings and send automated alerts to target departments.
- **Organization Chart**: Visual hierarchy showing Executive Admin, Department Managers, and Employees.

---

## Tech Stack

- **Frontend**: React.js, Vite, Lucide Icons, Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Deployment**: Vercel (Frontend) & Render (Backend)

---

## Running Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/vanshikatripathi1906/PeoplePulse.git
   cd PeoplePulse
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

*Created by Vanshika Tripathi*
