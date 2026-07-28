import React, { useState, useEffect } from "react";
import {
  Users, CheckCircle2, AlertCircle, Clock, Calendar, Plus, Edit3, Trash2, Trophy, Activity, MessageSquare, Award, ArrowUpRight, Check
} from "lucide-react";
import { Card } from "../common/Card";
import { StatCard } from "../common/StatCard";
import { SectionTitle } from "../common/SectionTitle";
import { DEPT_COLORS } from "../common/EmployeeBadge";

export function formatRelativeTime(timestamp) {
  if (!timestamp) return "Just now";
  const now = Date.now();
  const ts = typeof timestamp === "number" ? timestamp : new Date(timestamp).getTime();
  if (isNaN(ts)) return String(timestamp);

  const diffMs = now - ts;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const DEFAULT_METRICS = {
  totalEmployees: 25,
  employeesPresent: 22,
  onLeave: 2,
  wfh: 4,
  hiringRate: "+12.5%",
  newHires: 4,
  interviewsScheduled: 8,
  openPositions: 5,
  offerAcceptanceRate: "88%",
  lateArrivals: 3,
  earlyDepartures: 1,
  avgCheckIn: "09:12 AM",
};

const DEFAULT_TOP_PERFORMERS = [
  { name: "Aman Verma", role: "Engineering Head", score: 98, avatar: "AV", color: "#E8A33D", department: "Engineering" },
  { name: "Aditi Tripathi", role: "Backend Developer", score: 96, avatar: "AT", color: "#38BDF8", department: "Engineering" },
  { name: "Rahul Sharma", role: "Senior Engineering Manager", score: 94, avatar: "RS", color: "#2F8F82", department: "Engineering" },
  { name: "Priya Nair", role: "Product Head", score: 92, avatar: "PN", color: "#6C6FB0", department: "Product" },
  { name: "Vanshika Tripathi", role: "Frontend Developer", score: 91, avatar: "VT", color: "#EC4899", department: "Engineering" },
];

const DEFAULT_EVENTS = [
  { id: "e1", title: "Townhall Q3 Product Roadmap", day: "Tomorrow, 3:00 PM", tag: "All Hands Meeting", color: "#E8A33D" },
  { id: "e2", title: "Skill Matrix Sync", day: "Friday, 11:30 AM", tag: "Engineering Team", color: "#38BDF8" },
  { id: "e3", title: "Monthly Performance Review", day: "30 Jul, 2:00 PM", tag: "HR & Management", color: "#2F8F82" },
];

const DEFAULT_ACTIVITIES = [
  { id: "a1", createdAt: Date.now() - 10 * 60 * 1000, title: "Leave Approved", text: "Medical leave for Vanshika Tripathi was approved by Admin.", type: "leave" },
  { id: "a2", createdAt: Date.now() - 60 * 60 * 1000, title: "New Task Assigned", text: "Build Payment Gateway was assigned to Aditi Tripathi.", type: "task" },
  { id: "a3", createdAt: Date.now() - 180 * 60 * 1000, title: "Attendance Marked", text: "22 employees checked in for today.", type: "attendance" },
];

export function DashboardModule({ role, employees = [], leaveRequests = [], goProfile, currentUser }) {
  const isAdmin = role === "Admin";
  const isManager = role === "Manager";
  const isEmployee = role === "Employee";

  const userDept = currentUser?.department || "Engineering";

  const [metrics, setMetrics] = useState(() => {
    try {
      const saved = localStorage.getItem("peoplepulse_dashboard_metrics");
      return saved ? { ...DEFAULT_METRICS, ...JSON.parse(saved) } : DEFAULT_METRICS;
    } catch (e) {
      return DEFAULT_METRICS;
    }
  });

  const [eventsList, setEventsList] = useState(() => {
    try {
      const saved = localStorage.getItem("peoplepulse_events");
      return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
    } catch (e) {
      return DEFAULT_EVENTS;
    }
  });

  const [activitiesList, setActivitiesList] = useState(() => {
    try {
      const saved = localStorage.getItem("peoplepulse_activities");
      return saved ? JSON.parse(saved) : DEFAULT_ACTIVITIES;
    } catch (e) {
      return DEFAULT_ACTIVITIES;
    }
  });

  const [notification, setNotification] = useState(null);

  // Modals
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", day: "Tomorrow, 3:00 PM", tag: "General" });
  const [modalType, setModalType] = useState(null);

  const safeTotal = employees.length > 0 ? employees.length : metrics.totalEmployees;
  const safeApprovedLeave = leaveRequests.filter((r) => r.status === "Approved").length;

  // DYNAMIC DEPARTMENT-WISE TOP PERFORMERS & RANKINGS FROM MONGODB ATLAS
  const allScoredEmployees = (employees && employees.length > 0)
    ? employees.map((emp) => {
        const t = Number(emp.perf?.Technical) || 8;
        const c = Number(emp.perf?.Communication) || 8;
        const l = Number(emp.perf?.Leadership) || 7;
        const stars = Number(emp.perf?.stars) || Math.min(5, Math.max(1, Math.round((t + c + l) / 6)));
        const score = Math.min(99, Math.round(((t + c + l) / 30) * 80 + stars * 4));
        const avatar = emp.initials || (emp.name ? emp.name.split(" ").map((w) => w[0]).slice(0, 2).join("") : "EM");
        return {
          name: emp.name,
          email: emp.email,
          empId: emp.empId,
          department: emp.department || "Engineering",
          role: emp.designation || emp.role || "Team Member",
          score: score,
          avatar: avatar,
          color: DEPT_COLORS[emp.department] || "#38BDF8",
        };
      })
    : DEFAULT_TOP_PERFORMERS;

  // Filter department top performers for Employee & Manager view
  const deptRankedList = [...allScoredEmployees]
    .filter((e) => !userDept || (e.department || "").toLowerCase() === userDept.toLowerCase())
    .sort((a, b) => b.score - a.score);

  const displayPerformers = deptRankedList.length > 0 ? deptRankedList.slice(0, 5) : allScoredEmployees.sort((a, b) => b.score - a.score).slice(0, 5);
  const employeeOfTheMonth = deptRankedList[0] || allScoredEmployees[0] || DEFAULT_TOP_PERFORMERS[0];

  // Calculate current logged in user's rank inside their department
  const userIndexInDept = deptRankedList.findIndex(
    (e) => (currentUser?.email && e.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
           (currentUser?.name && e.name?.toLowerCase() === currentUser.name.toLowerCase()) ||
           e.name === "Vanshika Tripathi"
  );
  const userDeptRank = userIndexInDept !== -1 ? userIndexInDept + 1 : 1;
  const userDeptScore = userIndexInDept !== -1 ? deptRankedList[userIndexInDept]?.score : 91;

  const stats = [
    { label: "TOTAL EMPLOYEES", value: safeTotal.toString(), sub: "active workforce", icon: Users, accent: "#E8A33D", clickType: "total" },
    { label: "EMPLOYEES PRESENT", value: Math.max(1, safeTotal - safeApprovedLeave).toString(), sub: "checked in today", icon: CheckCircle2, accent: "#2F8F82", clickType: "present" },
    { label: "ON LEAVE", value: safeApprovedLeave.toString(), sub: "approved leave", icon: AlertCircle, accent: "#E2604F", clickType: "leave" },
    { label: "REMOTE / WFH", value: (metrics.wfh || 4).toString(), sub: "working remotely", icon: Clock, accent: "#38BDF8", clickType: "wfh" },
  ];

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!isManager || !eventForm.title.trim()) return;

    const newEv = {
      id: `e${Date.now()}`,
      title: eventForm.title,
      day: eventForm.day,
      tag: eventForm.tag,
      color: "#38BDF8",
    };

    const updated = [newEv, ...eventsList];
    setEventsList(updated);
    localStorage.setItem("peoplepulse_events", JSON.stringify(updated));
    setShowEventModal(false);
    setEventForm({ title: "", day: "Tomorrow, 3:00 PM", tag: "General" });

    // Send Notification
    try {
      const savedNotifs = localStorage.getItem("peoplepulse_notifications");
      const currentNotifs = savedNotifs ? JSON.parse(savedNotifs) : [];
      const newNotif = {
        id: Date.now(),
        title: "New Event Scheduled",
        message: `${newEv.title} has been scheduled for ${newEv.day}.`,
        createdAt: Date.now(),
        unread: true,
      };
      localStorage.setItem("peoplepulse_notifications", JSON.stringify([newNotif, ...currentNotifs]));
    } catch (e) {}

    setNotification(`Event "${eventForm.title}" scheduled successfully!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDeleteEvent = (id, title) => {
    if (!isManager) return;
    const updated = eventsList.filter((e) => e.id !== id);
    setEventsList(updated);
    localStorage.setItem("peoplepulse_events", JSON.stringify(updated));
    setNotification(`Deleted event "${title}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Helper Component: Upcoming Events Card
  const UpcomingEventsCard = () => (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="nf-avatar sm" style={{ background: "#6C6FB026", color: "#6C6FB0" }}>
            <Calendar size={16} />
          </div>
          <h3 className="nf-h3" style={{ margin: 0 }}>Upcoming Events</h3>
        </div>
        {isManager && (
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

            {isManager && (
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
  );

  // Helper Component: Top Performers Card (Department-Wise)
  const TopPerformersCard = () => (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="nf-avatar sm" style={{ background: "#E8A33D26", color: "#E8A33D" }}>
            <Trophy size={16} />
          </div>
          <div>
            <h3 className="nf-h3" style={{ margin: 0 }}>Top Performers</h3>
            <div style={{ fontSize: 11.5, color: "var(--ink-dim)", marginTop: 2 }}>
              {userDept} Department
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "linear-gradient(135deg, rgba(232,163,61,0.18), rgba(56,189,248,0.1))",
          border: "1px solid rgba(232,163,61,0.35)",
          borderRadius: 12,
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="nf-avatar" style={{ background: "#E8A33D", color: "#090B13", fontWeight: 700 }}>
            {employeeOfTheMonth.avatar}
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#E8A33D", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              🏆 {userDept} Star Performer
            </div>
            <div style={{ fontWeight: 700, fontSize: 14.5, marginTop: 2 }}>{employeeOfTheMonth.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-dim)" }}>{employeeOfTheMonth.role}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>Score</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#E8A33D" }}>{employeeOfTheMonth.score}</div>
        </div>
      </div>

      {/* Logged in User Department Rank Banner */}
      {userDeptRank && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            background: "rgba(47,143,130,0.12)",
            border: "1px solid #2F8F82",
            borderRadius: 10,
            marginBottom: 14,
            fontSize: 12.5,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, color: "#2F8F82" }}>
            <Award size={15} /> Your {userDept} Rank: <strong>#{userDeptRank}</strong>
          </div>
          <div style={{ fontWeight: 700, color: "#2F8F82" }}>Score: {userDeptScore}</div>
        </div>
      )}

      <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink-dim)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Top 5 Performers in {userDept}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {displayPerformers.map((p, idx) => {
          const isCurrentUserRow = currentUser && (
            (currentUser.name && p.name.toLowerCase() === currentUser.name.toLowerCase()) ||
            (currentUser.email && p.email && p.email.toLowerCase() === currentUser.email.toLowerCase()) ||
            p.name === "Vanshika Tripathi"
          );

          return (
            <div
              key={p.name + idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                background: isCurrentUserRow ? "rgba(47,143,130,0.14)" : "var(--surface-alt)",
                border: isCurrentUserRow ? "1px solid #2F8F82" : "1px solid transparent",
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
                  <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    {p.name}
                    {isCurrentUserRow && (
                      <span style={{ fontSize: 10, background: "#2F8F82", color: "#fff", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>
                        YOU (# {idx + 1})
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>{p.role}</div>
                </div>
              </div>
              <span className="nf-mono" style={{ fontWeight: 700, color: idx === 0 ? "#E8A33D" : "var(--accent-2)" }}>
                {p.score}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );

  return (
    <>
      <SectionTitle
        title={isEmployee ? "Employee Dashboard Overview" : isManager ? "Manager Dashboard Overview" : "Workforce Command Center"}
      />

      {notification && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {/* Schedule Event Modal - ACCESSIBLE TO MANAGER ONLY */}
      {showEventModal && isManager && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 440, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Schedule Company Event</h3>
            <form onSubmit={handleCreateEvent} className="nf-form">
              <label>Event Title
                <input className="nf-select" placeholder="e.g. Q3 Townhall" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
              </label>
              <label>Date &amp; Time
                <input className="nf-select" placeholder="e.g. Friday, 3:00 PM" value={eventForm.day} onChange={(e) => setEventForm({ ...eventForm, day: e.target.value })} required />
              </label>
              <label>Event Tag / Department
                <input className="nf-select" placeholder="e.g. All Hands Meeting" value={eventForm.tag} onChange={(e) => setEventForm({ ...eventForm, tag: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setShowEventModal(false)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Schedule Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ROLE SPECIFIC DASHBOARD VIEWS */}

      {/* 1. MANAGER DASHBOARD: SHOWS UPCOMING EVENTS ONLY */}
      {isManager && (
        <div style={{ maxWidth: 700 }}>
          <UpcomingEventsCard />
        </div>
      )}

      {/* 2. EMPLOYEE DASHBOARD: SHOWS UPCOMING EVENTS & TOP PERFORMERS ONLY */}
      {isEmployee && (
        <div className="nf-grid-2" style={{ marginBottom: 28 }}>
          <UpcomingEventsCard />
          <TopPerformersCard />
        </div>
      )}

      {/* 3. ADMIN DASHBOARD: FULL COMPREHENSIVE VIEW */}
      {isAdmin && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            {stats.map((s) => (
              <div key={s.label} onClick={() => s.clickType && setModalType(s.clickType)} style={{ cursor: s.clickType ? "pointer" : "default" }}>
                <StatCard {...s} />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 28, maxWidth: 800 }}>
            <UpcomingEventsCard />
          </div>

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
                {activitiesList.map((act) => (
                  <div
                    key={act.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "var(--surface-alt)",
                      borderRadius: 10,
                      fontSize: 13,
                    }}
                  >
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{act.title}</div>
                        <div style={{ fontSize: 12, color: "var(--ink-dim)", marginTop: 2 }}>{act.text}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>
                      {formatRelativeTime(act.createdAt || act.timestamp || act.time)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
