import React, { useState, useEffect } from "react";
import { Users, BadgeCheck, Clock, Building2, Cake, Calendar, Trophy, Plus, Trash2, Edit3, CheckCircle2, Activity, Send, Laptop } from "lucide-react";
import { StatCard } from "../common/StatCard";
import { EmployeeBadge } from "../common/EmployeeBadge";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";

const getRealDateString = (offsetDays) => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + offsetDays);
  const dayName = targetDate.toLocaleDateString("en-US", { weekday: "short" });
  const dateNum = targetDate.getDate();
  const monthName = targetDate.toLocaleDateString("en-US", { month: "short" });
  if (offsetDays === 0) return `Today, ${dateNum} ${monthName}`;
  if (offsetDays === 1) return `Tomorrow, ${dateNum} ${monthName}`;
  return `${dayName}, ${dateNum < 10 ? "0" + dateNum : dateNum} ${monthName}`;
};

const INITIAL_EVENTS = [
  { id: 1, day: getRealDateString(1), title: "Annual Town Hall", tag: "Company Wide", color: "#3B82F6" },
  { id: 2, day: getRealDateString(5), title: "Hackathon 2026", tag: "Engineering & Product", color: "#E8A33D" },
  { id: 3, day: getRealDateString(8), title: "Payroll Release", tag: "Finance & HR", color: "#2F8F82" },
];

const INITIAL_TOP_PERFORMERS = [
  { rank: 1, name: "Emily Carter", role: "Product Designer", score: "98%", avatar: "EC", color: "#E8A33D" },
  { rank: 2, name: "Aman Verma", role: "Engineering Head", score: "96%", avatar: "AV", color: "#2F8F82" },
  { rank: 3, name: "Rahul Sharma", role: "Engineering Manager", score: "94%", avatar: "RS", color: "#3B82F6" },
  { rank: 4, name: "Vanshika Tripathi", role: "Frontend Developer", score: "93%", avatar: "VT", color: "#6C6FB0" },
  { rank: 5, name: "Ishita Rao", role: "Backend Developer", score: "91%", avatar: "IR", color: "#EC4899" },
];

const INITIAL_METRICS = {
  totalEmployees: 25,
  employeesPresent: 22,
  onLeave: 3,
  departments: 8,
  birthdayToday: 2,
  newHires: 4,
  interviewsScheduled: 3,
  openPositions: 5,
  offerAcceptanceRate: "92%",
  lateArrivals: 2,
  earlyDepartures: 1,
  avgCheckIn: "09:12 AM",
};

const INITIAL_ACTIVITIES = [
  { id: 1, user: "Ishita Rao", action: "applied for Sick Leave (28 Jul)", time: "15 mins ago", iconName: "Send", color: "#E2604F" },
  { id: 2, user: "Aman Verma", action: "assigned task 'Build Login Module' to Vanshika Tripathi", time: "1 hour ago", iconName: "CheckCircle2", color: "#3B82F6" },
  { id: 3, user: "Vanshika Tripathi", action: "checked in at 09:12 AM for today's work shift", time: "Today", iconName: "Clock", color: "#2F8F82" },
  { id: 4, user: "Rahul Sharma", action: "approved 3 pending leave applications", time: "3 hours ago", iconName: "CheckCircle2", color: "#6C6FB0" },
  { id: 5, user: "Priya Nair", action: "issued ThinkPad T14 Gen 4 to Devansh Patil", time: "Yesterday", iconName: "Laptop", color: "#E8A33D" },
];

const ON_LEAVE_21_EMPLOYEES = [
  { id: 101, empId: "EMP-1019", name: "Ishita Rao", designation: "Backend Developer", department: "Engineering", experience: "3 Years", manager: "Rahul Sharma", status: "On Leave" },
  { id: 102, empId: "EMP-1031", name: "Priya Nair", designation: "HR Head", department: "HR", experience: "8 Years", manager: "—", status: "On Leave" },
  { id: 103, empId: "EMP-1023", name: "Devansh Patil", designation: "QA Engineer", department: "Engineering", experience: "1.5 Years", manager: "Rahul Sharma", status: "On Leave" },
  { id: 104, empId: "EMP-1044", name: "Meera Iyer", designation: "Finance Lead", department: "Finance", experience: "5.2 Years", manager: "—", status: "On Leave" },
  { id: 105, empId: "EMP-1051", name: "Arjun Malhotra", designation: "Marketing Manager", department: "Marketing", experience: "4 Years", manager: "—", status: "On Leave" },
  { id: 106, empId: "EMP-1062", name: "Zara Ahmed", designation: "UI/UX Designer", department: "Design", experience: "3 Years", manager: "Emily Carter", status: "On Leave" },
  { id: 107, empId: "EMP-1070", name: "Nikhil Bhatt", designation: "Operations Analyst", department: "Operations", experience: "4.6 Years", manager: "—", status: "On Leave" },
  { id: 108, empId: "EMP-1083", name: "Kavya Joshi", designation: "Full Stack Engineer", department: "Engineering", experience: "2.5 Years", manager: "Aman Verma", status: "On Leave" },
  { id: 109, empId: "EMP-1091", name: "Rohan Kapoor", designation: "DevOps Engineer", department: "Engineering", experience: "4 Years", manager: "Aman Verma", status: "On Leave" },
  { id: 110, empId: "EMP-1102", name: "Sneha Reddy", designation: "Recruitment Specialist", department: "HR", experience: "3.2 Years", manager: "Priya Nair", status: "On Leave" },
  { id: 111, empId: "EMP-1115", name: "Tanmay Sen", designation: "Security Specialist", department: "Engineering", experience: "5 Years", manager: "Rahul Sharma", status: "On Leave" },
  { id: 112, empId: "EMP-1120", name: "Ananya Roy", designation: "Content Strategist", department: "Marketing", experience: "2 Years", manager: "Arjun Malhotra", status: "On Leave" },
  { id: 113, empId: "EMP-1133", name: "Vikram Seth", designation: "Financial Accountant", department: "Finance", experience: "6 Years", manager: "Meera Iyer", status: "On Leave" },
  { id: 114, empId: "EMP-1148", name: "Aditi Saxena", designation: "Customer Success Executive", department: "Sales", experience: "2.8 Years", manager: "—", status: "On Leave" },
  { id: 115, empId: "EMP-1150", name: "Siddharth Das", designation: "Backend Engineer", department: "Engineering", experience: "3.5 Years", manager: "Rahul Sharma", status: "On Leave" },
  { id: 116, empId: "EMP-1164", name: "Pooja Hegde", designation: "PR Specialist", department: "Marketing", experience: "4.1 Years", manager: "Arjun Malhotra", status: "On Leave" },
  { id: 117, empId: "EMP-1172", name: "Manish Kumar", designation: "System Admin", department: "IT", experience: "7 Years", manager: "Nikhil Bhatt", status: "On Leave" },
  { id: 118, empId: "EMP-1189", name: "Richa Sharma", designation: "Payroll Associate", department: "Finance", experience: "3 Years", manager: "Meera Iyer", status: "On Leave" },
  { id: 119, empId: "EMP-1195", name: "Varun Mehta", designation: "Sales Manager", department: "Sales", experience: "5.5 Years", manager: "—", status: "On Leave" },
  { id: 120, empId: "EMP-1201", name: "Tanya Grover", designation: "Product Manager", department: "Product", experience: "4 Years", manager: "Emily Carter", status: "On Leave" },
  { id: 121, empId: "EMP-1210", name: "Yash Chopra", designation: "Data Scientist", department: "Engineering", experience: "3.8 Years", manager: "Aman Verma", status: "On Leave" },
];

ON_LEAVE_21_EMPLOYEES.forEach((emp) => {
  emp.initials = emp.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
});

export function DashboardModule({ role, employees, leaveRequests = [], goProfile }) {
  const [modalType, setModalType] = useState(null);

  const [metrics, setMetrics] = useState(() => {
    try {
      const saved = localStorage.getItem("peoplepulse_dashboard_metrics");
      return saved ? { ...INITIAL_METRICS, ...JSON.parse(saved) } : INITIAL_METRICS;
    } catch (e) {
      return INITIAL_METRICS;
    }
  });

  const [eventsList, setEventsList] = useState(() => {
    try {
      const saved = localStorage.getItem("peoplepulse_events");
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch (e) {
      return INITIAL_EVENTS;
    }
  });

  const [topPerformersList, setTopPerformersList] = useState(() => {
    try {
      const saved = localStorage.getItem("peoplepulse_top_performers");
      return saved ? JSON.parse(saved) : INITIAL_TOP_PERFORMERS;
    } catch (e) {
      return INITIAL_TOP_PERFORMERS;
    }
  });

  const [activitiesList, setActivitiesList] = useState(() => {
    try {
      const saved = localStorage.getItem("peoplepulse_activities");
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch (e) {
      return INITIAL_ACTIVITIES;
    }
  });

  useEffect(() => {
    localStorage.setItem("peoplepulse_dashboard_metrics", JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem("peoplepulse_events", JSON.stringify(eventsList));
  }, [eventsList]);

  useEffect(() => {
    localStorage.setItem("peoplepulse_top_performers", JSON.stringify(topPerformersList));
  }, [topPerformersList]);

  useEffect(() => {
    localStorage.setItem("peoplepulse_activities", JSON.stringify(activitiesList));
  }, [activitiesList]);

  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showRankingsModal, setShowRankingsModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [notification, setNotification] = useState(null);

  const [editMetricsForm, setEditMetricsForm] = useState(INITIAL_METRICS);
  const [eventForm, setEventForm] = useState({ title: "", day: "Tomorrow, 26 Jul", tag: "Company Wide" });
  const [editRankingsForm, setEditRankingsForm] = useState(INITIAL_TOP_PERFORMERS);
  const [activityForm, setActivityForm] = useState({ user: "", action: "", time: "Today" });

  const isManagerOrAdmin = role === "Admin" || role === "Manager";

  const activeEmployees = employees || [];
  const approvedLeaveCount = leaveRequests && leaveRequests.length > 0
    ? leaveRequests.filter((r) => r.status === "Approved").length
    : (metrics?.onLeave ?? 3);

  const safeTotal = activeEmployees && activeEmployees.length > 0 ? activeEmployees.length : (metrics?.totalEmployees ?? 25);
  const safeLeave = approvedLeaveCount;
  const safePresent = Math.max(0, safeTotal - safeLeave);
  const safeDepts = metrics?.departments ?? 12;
  const safeBirthday = metrics?.birthdayToday ?? 2;

  const calculatedPresentPct = ((safePresent / safeTotal) * 100).toFixed(1);

  const stats = [
    { label: "Total Employees", value: safeTotal.toString(), sub: "Active workforce team", icon: Users, accent: "#E8A33D" },
    { label: "Employees Present", value: safePresent.toString(), sub: `${calculatedPresentPct}% today — click to view`, icon: BadgeCheck, accent: "#2F8F82", clickType: "present" },
    { label: "On Leave", value: safeLeave.toString(), sub: `${safeLeave} approved on leave — click to view`, icon: Clock, accent: "#E2604F", clickType: "leave" },
    { label: "Departments", value: safeDepts.toString(), sub: `${safeDepts} active departments — click to view`, icon: Building2, accent: "#6C6FB0", clickType: "departments" },
    { label: "Birthday Today", value: safeBirthday.toString(), sub: "click to view & wish", icon: Cake, accent: "#EC4899", clickType: "birthday" },
  ];

  const getModalTitle = () => {
    if (modalType === "total") return `All Workspace Employees (${safeTotal})`;
    if (modalType === "present") return `Employees Present Today (${safePresent})`;
    if (modalType === "leave") return `Employees Currently On Leave (${safeLeave})`;
    if (modalType === "departments") return `Active Workspace Departments (${safeDepts})`;
    if (modalType === "birthday") return "Employees Celebrating Birthdays Today 🎉";
    return "";
  };

  const generateDynamicEmployees = (targetCount, statusLabel) => {
    const names = [
      "Aman Verma", "Vanshika Tripathi", "Rahul Sharma", "Ishita Rao", "Devansh Patil",
      "Priya Nair", "Meera Iyer", "Arjun Malhotra", "Zara Ahmed", "Nikhil Bhatt",
      "Kavya Joshi", "Rohan Kapoor", "Sneha Reddy", "Tanmay Sen", "Ananya Roy",
      "Vikram Seth", "Aditi Saxena", "Siddharth Das", "Pooja Hegde", "Manish Kumar",
      "Richa Sharma", "Varun Mehta", "Tanya Grover", "Yash Chopra", "Emily Carter"
    ];
    const roles = ["Engineering Head", "Frontend Developer", "Engineering Manager", "Backend Developer", "QA Engineer", "HR Head", "Finance Lead", "Marketing Manager", "UI/UX Designer", "DevOps Engineer"];
    const depts = ["Engineering", "HR", "Finance", "Marketing", "Sales", "Operations"];

    const list = [];
    const count = Number(targetCount) || 1;
    for (let i = 0; i < count; i++) {
      const baseName = names[i % names.length];
      const name = i >= names.length ? `${baseName} (${Math.floor(i / names.length) + 1})` : baseName;
      const empId = `EMP-${1001 + i}`;
      const dept = depts[i % depts.length];
      const roleName = roles[i % roles.length];

      list.push({
        id: `dyn-${i}`,
        empId,
        name,
        designation: roleName,
        department: dept,
        experience: `${(i % 8) + 1} Years`,
        manager: i % 3 === 0 ? "Aman Verma" : "Rahul Sharma",
        status: statusLabel || "Active",
        initials: baseName.split(" ").map((w) => w[0]).slice(0, 2).join(""),
      });
    }
    return list;
  };

  const getModalList = () => {
    if (modalType === "total") return activeEmployees.slice(0, safeTotal);
    if (modalType === "present") return activeEmployees.filter((_, i) => i % 8 !== 4).slice(0, safePresent);
    if (modalType === "leave") return activeEmployees.filter((_, i) => i % 8 === 4).slice(0, safeLeave);
    if (modalType === "birthday") return activeEmployees.slice(0, safeBirthday);
    return [];
  };

  const handleSaveMetrics = (e) => {
    e.preventDefault();
    if (!isManagerOrAdmin) return;
    setMetrics({
      ...editMetricsForm,
      totalEmployees: Number(editMetricsForm.totalEmployees),
      employeesPresent: Number(editMetricsForm.employeesPresent),
      onLeave: Number(editMetricsForm.onLeave),
      departments: Number(editMetricsForm.departments),
      birthdayToday: Number(editMetricsForm.birthdayToday),
      newHires: Number(editMetricsForm.newHires),
      interviewsScheduled: Number(editMetricsForm.interviewsScheduled),
      openPositions: Number(editMetricsForm.openPositions),
      lateArrivals: Number(editMetricsForm.lateArrivals),
      earlyDepartures: Number(editMetricsForm.earlyDepartures),
    });
    setShowMetricsModal(false);
    setNotification("Successfully updated Workforce & Hiring Metrics!");
    setTimeout(() => setNotification(null), 3500);
  };

  const handleScheduleEvent = (e) => {
    e.preventDefault();
    if (!isManagerOrAdmin || !eventForm.title.trim()) return;

    const colors = ["#3B82F6", "#E8A33D", "#2F8F82", "#EC4899", "#6C6FB0"];
    const newEvent = {
      id: Date.now(),
      title: eventForm.title,
      day: eventForm.day,
      tag: eventForm.tag,
      color: colors[eventsList.length % colors.length],
    };

    setEventsList([...eventsList, newEvent]);
    setShowEventModal(false);
    setEventForm({ title: "", day: "Tomorrow, 26 Jul", tag: "Company Wide" });
    setNotification(`Successfully scheduled "${eventForm.title}"!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDeleteEvent = (id, title) => {
    if (!isManagerOrAdmin) return;
    setEventsList(eventsList.filter((ev) => ev.id !== id));
    setNotification(`Removed event "${title}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveRankings = (e) => {
    e.preventDefault();
    if (!isManagerOrAdmin) return;
    setTopPerformersList(editRankingsForm);
    setShowRankingsModal(false);
    setNotification("Daily Top Performers list updated successfully!");
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDeleteActivity = (id) => {
    if (!isManagerOrAdmin) return;
    setActivitiesList(activitiesList.filter((act) => act.id !== id));
    setNotification("Removed activity log entry.");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveActivityEdit = (e) => {
    e.preventDefault();
    if (!isManagerOrAdmin || !editingActivity) return;

    setActivitiesList(
      activitiesList.map((act) => (act.id === editingActivity.id ? { ...act, ...activityForm } : act))
    );
    setEditingActivity(null);
    setNotification("Updated activity log entry!");
    setTimeout(() => setNotification(null), 3500);
  };

  const deptAttendance = [
    { name: "Engineering", pct: 94 },
    { name: "HR", pct: 98 },
    { name: "Finance", pct: 91 },
    { name: "Marketing", pct: 95 },
  ];

  const employeeOfTheMonth = topPerformersList[0] || INITIAL_TOP_PERFORMERS[0];

  return (
    <>
      <SectionTitle
        title="Workforce Overview"
        action={
          isManagerOrAdmin && (
            <button className="nf-btn primary sm" onClick={() => { setEditMetricsForm({ ...metrics }); setShowMetricsModal(true); }}>
              <Edit3 size={13} /> Edit Overview Metrics
            </button>
          )
        }
      />

      {notification && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {/* Edit Overview Metrics Modal (Admin/Manager Only) */}
      {showMetricsModal && isManagerOrAdmin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 540, width: "100%", maxHeight: "85vh", overflow: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Edit Dashboard Metrics</h3>
            <form onSubmit={handleSaveMetrics} className="nf-form">
              <div style={{ fontWeight: 700, fontSize: 12, color: "var(--accent)", marginBottom: 6, textTransform: "uppercase" }}>Workforce Stats</div>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Total Employees
                  <input type="number" className="nf-select" value={editMetricsForm.totalEmployees} onChange={(e) => setEditMetricsForm({ ...editMetricsForm, totalEmployees: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Employees Present
                  <input type="number" className="nf-select" value={editMetricsForm.employeesPresent} onChange={(e) => setEditMetricsForm({ ...editMetricsForm, employeesPresent: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>On Leave
                  <input type="number" className="nf-select" value={editMetricsForm.onLeave} onChange={(e) => setEditMetricsForm({ ...editMetricsForm, onLeave: e.target.value })} required />
                </label>
              </div>

              <div style={{ fontWeight: 700, fontSize: 12, color: "var(--accent)", marginTop: 12, marginBottom: 6, textTransform: "uppercase" }}>Hiring Overview</div>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>New Hires
                  <input type="number" className="nf-select" value={editMetricsForm.newHires} onChange={(e) => setEditMetricsForm({ ...editMetricsForm, newHires: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Interviews
                  <input type="number" className="nf-select" value={editMetricsForm.interviewsScheduled} onChange={(e) => setEditMetricsForm({ ...editMetricsForm, interviewsScheduled: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Open Positions
                  <input type="number" className="nf-select" value={editMetricsForm.openPositions} onChange={(e) => setEditMetricsForm({ ...editMetricsForm, openPositions: e.target.value })} required />
                </label>
              </div>

              <div style={{ fontWeight: 700, fontSize: 12, color: "var(--accent)", marginTop: 12, marginBottom: 6, textTransform: "uppercase" }}>Attendance Insights</div>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Late Arrivals
                  <input type="number" className="nf-select" value={editMetricsForm.lateArrivals} onChange={(e) => setEditMetricsForm({ ...editMetricsForm, lateArrivals: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Early Departures
                  <input type="number" className="nf-select" value={editMetricsForm.earlyDepartures} onChange={(e) => setEditMetricsForm({ ...editMetricsForm, earlyDepartures: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Avg Check-in
                  <input className="nf-select" value={editMetricsForm.avgCheckIn} onChange={(e) => setEditMetricsForm({ ...editMetricsForm, avgCheckIn: e.target.value })} required />
                </label>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setShowMetricsModal(false)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Save Metrics &amp; Auto-Align</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Activity Modal (Admin/Manager Only) */}
      {editingActivity && isManagerOrAdmin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 440, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Edit Recent Activity Entry</h3>
            <form onSubmit={handleSaveActivityEdit} className="nf-form">
              <label>User Name
                <input className="nf-select" value={activityForm.user} onChange={(e) => setActivityForm({ ...activityForm, user: e.target.value })} required />
              </label>
              <label>Action Description
                <input className="nf-select" value={activityForm.action} onChange={(e) => setActivityForm({ ...activityForm, action: e.target.value })} required />
              </label>
              <label>Timestamp
                <input className="nf-select" value={activityForm.time} onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setEditingActivity(null)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Stat Card Modal */}
      {modalType && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 740, width: "100%", maxHeight: "80vh", overflow: "auto", background: "var(--surface)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 className="nf-h3" style={{ margin: 0 }}>{getModalTitle()}</h3>
              <button className="nf-btn ghost sm" onClick={() => setModalType(null)}>Close</button>
            </div>

            {modalType === "departments" ? (
              <div className="nf-grid-2">
                {[
                  { name: "Engineering", head: "Aman Verma", count: 128, projects: 18 },
                  { name: "HR", head: "Priya Nair", count: 34, projects: 4 },
                  { name: "Finance", head: "Meera Iyer", count: 52, projects: 6 },
                  { name: "Marketing", head: "Arjun Malhotra", count: 61, projects: 9 },
                  { name: "Sales", head: "Varun Mehta", count: 45, projects: 11 },
                  { name: "Operations", head: "Nikhil Bhatt", count: 39, projects: 5 },
                  { name: "Product & Design", head: "Kavya Menon", count: 28, projects: 7 },
                  { name: "Legal & Compliance", head: "Rohan Kapoor", count: 18, projects: 3 },
                  { name: "IT Infrastructure", head: "Siddharth Jain", count: 24, projects: 5 },
                  { name: "Data Science & AI", head: "Yash Chopra", count: 31, projects: 8 },
                  { name: "Quality Assurance", head: "Devansh Patil", count: 22, projects: 6 },
                  { name: "Customer Success", head: "Aditi Saxena", count: 36, projects: 4 },
                ].slice(0, Number(metrics.departments) || 12).map((d) => (
                  <div key={d.name} style={{ background: "var(--surface-alt)", padding: "14px 16px", borderRadius: 12, border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div className="nf-avatar sm" style={{ background: "#6C6FB026", color: "#6C6FB0" }}>
                        <Building2 size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14.5 }}>{d.name}</div>
                        <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>Head: {d.head}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--ink-dim)", marginTop: 8 }}>
                      <div><strong style={{ color: "var(--ink)" }}>{d.count}</strong> employees</div>
                      <div><strong style={{ color: "var(--accent-2)" }}>{d.projects}</strong> active projects</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="nf-grid-2">
                {getModalList().map((emp) => (
                  <div key={emp.id || emp.empId} style={{ cursor: "pointer" }} onClick={() => { setModalType(null); if (goProfile) goProfile(emp); }}>
                    <EmployeeBadge emp={emp} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule Event Modal (Admin/Manager Only) */}
      {showEventModal && isManagerOrAdmin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 440, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Schedule Upcoming Event</h3>
            <form onSubmit={handleScheduleEvent} className="nf-form">
              <label>Event Title
                <input className="nf-select" placeholder="e.g. Q3 All Hands Sync" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Event Day &amp; Date
                  <input className="nf-select" placeholder="e.g. Tomorrow, 26 Jul" value={eventForm.day} onChange={(e) => setEventForm({ ...eventForm, day: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Target Group / Tag
                  <input className="nf-select" placeholder="e.g. Company Wide" value={eventForm.tag} onChange={(e) => setEventForm({ ...eventForm, tag: e.target.value })} required />
                </label>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setShowEventModal(false)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Schedule Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Daily Top Performers Modal (Admin/Manager Only) */}
      {showRankingsModal && isManagerOrAdmin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 500, width: "100%", maxHeight: "80vh", overflow: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Update Daily Top Performers</h3>
            <form onSubmit={handleSaveRankings} className="nf-form">
              {editRankingsForm.map((p, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, alignItems: "center", background: "var(--surface-alt)", padding: 8, borderRadius: 8 }}>
                  <span className="nf-mono" style={{ fontWeight: 700, width: 24 }}>#{idx + 1}</span>
                  <input
                    className="nf-select"
                    style={{ flex: 2 }}
                    placeholder="Name"
                    value={p.name}
                    onChange={(e) => {
                      const updated = [...editRankingsForm];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      setEditRankingsForm(updated);
                    }}
                    required
                  />
                  <input
                    className="nf-select"
                    style={{ flex: 1 }}
                    placeholder="Score %"
                    value={p.score}
                    onChange={(e) => {
                      const updated = [...editRankingsForm];
                      updated[idx] = { ...updated[idx], score: e.target.value };
                      setEditRankingsForm(updated);
                    }}
                    required
                  />
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setShowRankingsModal(false)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Save Rankings</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workforce Overview Stat Cards Grid */}
      <div className="nf-grid-5" style={{ marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.label} onClick={() => s.clickType && setModalType(s.clickType)} style={{ cursor: s.clickType ? "pointer" : "default" }}>
            <StatCard {...s} />
          </div>
        ))}
      </div>

      {/* Hiring Overview & Attendance Insights Cards */}
      <div className="nf-grid-2" style={{ marginBottom: 28 }}>
        {/* Hiring Overview Card */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div className="nf-avatar sm" style={{ background: "#3B82F626", color: "#3B82F6" }}>
              <Users size={16} />
            </div>
            <h3 className="nf-h3" style={{ margin: 0 }}>Hiring Overview</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ background: "var(--surface-alt)", padding: "12px 14px", borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>New Hires This Month</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4, color: "var(--ink)" }}>{metrics.newHires}</div>
            </div>
            <div style={{ background: "var(--surface-alt)", padding: "12px 14px", borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>Interviews Scheduled</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4, color: "var(--ink)" }}>{metrics.interviewsScheduled}</div>
            </div>
            <div style={{ background: "var(--surface-alt)", padding: "12px 14px", borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>Open Positions</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4, color: "var(--ink)" }}>{metrics.openPositions}</div>
            </div>
            <div style={{ background: "var(--surface-alt)", padding: "12px 14px", borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>Offer Acceptance Rate</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4, color: "#2F8F82" }}>{metrics.offerAcceptanceRate}</div>
            </div>
          </div>
        </Card>

        {/* Attendance Insights Card */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div className="nf-avatar sm" style={{ background: "#2F8F8226", color: "#2F8F82" }}>
              <Clock size={16} />
            </div>
            <h3 className="nf-h3" style={{ margin: 0 }}>Attendance Insights</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
            <div style={{ background: "var(--surface-alt)", padding: "10px 12px", borderRadius: 9, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>Late Arrivals</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2, color: "#E8A33D" }}>{metrics.lateArrivals}</div>
            </div>
            <div style={{ background: "var(--surface-alt)", padding: "10px 12px", borderRadius: 9, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>Early Departures</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2, color: "#E2604F" }}>{metrics.earlyDepartures}</div>
            </div>
            <div style={{ background: "var(--surface-alt)", padding: "10px 12px", borderRadius: 9, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>Avg Check-in</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4, color: "var(--ink)" }}>{metrics.avgCheckIn}</div>
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-dim)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Department-Wise Attendance
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {deptAttendance.map((d) => (
              <div key={d.name} style={{ display: "grid", gridTemplateColumns: "100px 1fr 40px", alignItems: "center", gap: 10, fontSize: 12 }}>
                <span>{d.name}</span>
                <div style={{ height: 6, background: "var(--surface-alt)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${d.pct}%`, background: "#2F8F82", borderRadius: 4 }} />
                </div>
                <span className="nf-mono" style={{ fontSize: 11, fontWeight: 600 }}>{d.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upcoming Events & Top Performers Cards */}
      <div className="nf-grid-2" style={{ marginBottom: 28 }}>
        {/* Upcoming Events Card */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="nf-avatar sm" style={{ background: "#6C6FB026", color: "#6C6FB0" }}>
                <Calendar size={16} />
              </div>
              <h3 className="nf-h3" style={{ margin: 0 }}>Upcoming Events</h3>
            </div>
            {isManagerOrAdmin && (
              <button className="nf-btn primary sm" onClick={() => setShowEventModal(true)}>
                <Plus size={13} /> Schedule Event
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {eventsList.map((ev) => (
              <div
                key={ev.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  background: "var(--surface-alt)",
                  borderRadius: 10,
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ textAlign: "center", minWidth: 100, padding: "4px 8px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: ev.color, textTransform: "uppercase" }}>{ev.day}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{ev.title}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-dim)" }}>{ev.tag}</div>
                  </div>
                </div>

                {isManagerOrAdmin && (
                  <button
                    className="nf-btn ghost sm danger"
                    title="Delete event"
                    style={{ padding: "4px 8px" }}
                    onClick={() => handleDeleteEvent(ev.id, ev.title)}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}

            {eventsList.length === 0 && (
              <div className="nf-empty" style={{ padding: 18 }}>No upcoming events scheduled.</div>
            )}
          </div>
        </Card>

        {/* Top Performers Card */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="nf-avatar sm" style={{ background: "#E8A33D26", color: "#E8A33D" }}>
                <Trophy size={16} />
              </div>
              <h3 className="nf-h3" style={{ margin: 0 }}>Top Performers</h3>
            </div>
            {isManagerOrAdmin && (
              <button className="nf-btn ghost sm" onClick={() => { setEditRankingsForm([...topPerformersList]); setShowRankingsModal(true); }}>
                <Edit3 size={13} /> Update Daily Rankings
              </button>
            )}
          </div>

          {/* Employee of the Month Highlight Banner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "linear-gradient(135deg, rgba(232,163,61,0.18), rgba(56,189,248,0.1))",
              border: "1px solid rgba(232,163,61,0.35)",
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div className="nf-avatar" style={{ background: "#E8A33D", color: "#090B13", fontWeight: 700 }}>
                {employeeOfTheMonth.avatar}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#E8A33D", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  🏆 Employee of the Month
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>{employeeOfTheMonth.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-dim)" }}>{employeeOfTheMonth.role}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>Performance</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#E8A33D" }}>{employeeOfTheMonth.score}</div>
            </div>
          </div>

          {/* Top 5 Performers List */}
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-dim)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Top 5 Performers Ranking
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {topPerformersList.map((p, idx) => (
              <div
                key={p.name + idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  background: "var(--surface-alt)",
                  borderRadius: 9,
                  fontSize: 12.5,
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span className="nf-mono" style={{ fontWeight: 700, color: "var(--ink-dim)", width: 14 }}>
                    #{idx + 1}
                  </span>
                  <div className="nf-avatar sm" style={{ background: `${p.color}26`, color: p.color, fontWeight: 700 }}>
                    {p.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>{p.role}</div>
                  </div>
                </div>
                <span className="nf-mono" style={{ fontWeight: 700, color: idx === 0 ? "#E8A33D" : "var(--accent-2)" }}>
                  {p.score}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Live Recent Activity Feed with Admin/Manager Edit & Delete Controls */}
      <div style={{ marginTop: 28 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="nf-avatar sm" style={{ background: "#2F8F8226", color: "#2F8F82" }}>
                <Activity size={16} />
              </div>
              <h3 className="nf-h3" style={{ margin: 0 }}>Recent Activity Feed</h3>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {activitiesList.map((act) => {
              let IconComp = Activity;
              if (typeof act.icon === "function") {
                IconComp = act.icon;
              } else if (act.iconName === "Send") {
                IconComp = Send;
              } else if (act.iconName === "CheckCircle2") {
                IconComp = CheckCircle2;
              } else if (act.iconName === "Clock") {
                IconComp = Clock;
              } else if (act.iconName === "Laptop") {
                IconComp = Laptop;
              }
              return (
                <div
                  key={act.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "var(--surface-alt)",
                    borderRadius: 10,
                    fontSize: 12.5,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="nf-avatar sm" style={{ background: `${act.color || "#38BDF8"}22`, color: act.color || "#38BDF8", flexShrink: 0 }}>
                      <IconComp size={14} />
                    </div>
                    <div>
                      <div>
                        <span style={{ fontWeight: 700, color: "var(--ink)" }}>{act.user}</span>{" "}
                        <span style={{ color: "var(--ink-dim)" }}>{act.action}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ink-dim)", marginTop: 2 }}>{act.time}</div>
                    </div>
                  </div>

                  {/* Request 4: Admin/Manager Edit & Delete for Activity Feed */}
                  {isManagerOrAdmin && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="nf-btn ghost sm"
                        style={{ padding: "4px 8px" }}
                        title="Edit Activity"
                        onClick={() => {
                          setEditingActivity(act);
                          setActivityForm({ user: act.user, action: act.action, time: act.time });
                        }}
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                      <button
                        className="nf-btn ghost sm danger"
                        style={{ padding: "4px 8px" }}
                        title="Delete Activity"
                        onClick={() => handleDeleteActivity(act.id)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {activitiesList.length === 0 && (
              <div className="nf-empty" style={{ padding: 18 }}>No activity feed entries.</div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
