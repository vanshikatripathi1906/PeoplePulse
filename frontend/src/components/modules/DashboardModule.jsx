import React, { useState, useEffect } from "react";
import {
  Users, CheckCircle2, AlertCircle, Clock, Calendar, Plus, Edit3, Trash2, Trophy, Activity, MessageSquare, Award, ArrowUpRight, Check
} from "lucide-react";
import { Card } from "../common/Card";
import { StatCard } from "../common/StatCard";
import { SectionTitle } from "../common/SectionTitle";
import { DEPT_COLORS } from "../common/EmployeeBadge";
import { Pill } from "../common/Pill";

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

export function formatEventDateLabel(dateStr, fallbackDayStr) {
  if (!dateStr) return fallbackDayStr || "UPCOMING";
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const evDate = new Date(dateStr);
  if (isNaN(evDate.getTime())) return fallbackDayStr || "UPCOMING";
  evDate.setHours(0, 0, 0, 0);

  const diffTime = evDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  if (diffDays < 0) {
    // Event date has passed -> Expired!
    return null;
  }

  const dayName = evDate.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const monthName = evDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const dayNum = String(evDate.getDate()).padStart(2, "0");

  if (diffDays === 0) return `TODAY, ${dayNum} ${monthName}`;
  if (diffDays === 1) return `TOMORROW, ${dayNum} ${monthName}`;
  return `${dayName}, ${dayNum} ${monthName}`;
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
  { id: "e1", title: "Townhall Q3 Product Roadmap", date: "2026-07-30", time: "3:00 PM", day: "TOMORROW, 30 JUL", tag: "All Hands Meeting", color: "#E8A33D" },
  { id: "e2", title: "Skill Matrix Sync", date: "2026-07-31", time: "11:30 AM", day: "FRI, 31 JUL", tag: "Engineering Team", color: "#38BDF8" },
  { id: "e3", title: "Monthly Performance Review", date: "2026-08-03", time: "2:00 PM", day: "MON, 03 AUG", tag: "HR & Management", color: "#2F8F82" },
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

  const [notification, setNotification] = useState(null);

  // Modals
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", date: "2026-07-30", time: "03:00 PM", tag: "All Hands Meeting" });
  const [modalType, setModalType] = useState(null);

  const safeTotal = employees.length > 0 ? employees.length : metrics.totalEmployees;
  const safeApprovedLeave = leaveRequests.filter((r) => r.status === "Approved").length;

  // Filter active future upcoming events only (expired past events automatically removed)
  const activeUpcomingEvents = eventsList.filter((ev) => {
    if (ev.date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const evDate = new Date(ev.date);
      evDate.setHours(0, 0, 0, 0);
      if (evDate.getTime() < today.getTime()) {
        return false; // Expired event date -> automatically remove from list!
      }
    }
    return true;
  });

  // DYNAMIC DEPARTMENT-WISE TOP PERFORMERS & RANKINGS FROM MONGODB ATLAS
  const allScoredEmployees = (employees && employees.length > 0)
    ? employees
        .filter((emp) => emp.role !== "Admin" && emp.name !== "Aman Verma")
        .map((emp) => {
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

  const nonAdminEmployees = (employees || []).filter(
    (e) => e.role !== "Admin" && e.name !== "Aman Verma"
  );
  const totalManagers = nonAdminEmployees.filter((e) => e.role === "Manager").length || 5;
  const totalEmployeesOnly = nonAdminEmployees.filter((e) => e.role === "Employee").length;
  const totalWorkforce = nonAdminEmployees.length || (totalManagers + totalEmployeesOnly);

  const stats = [
    {
      label: "TOTAL WORKFORCE",
      value: totalWorkforce.toString(),
      sub: `${totalManagers} Managers · ${totalEmployeesOnly} Employees`,
      icon: Users,
      accent: "#E8A33D",
      clickType: "total",
    },
    {
      label: "WORKFORCE PRESENT",
      value: Math.max(1, totalWorkforce - safeApprovedLeave).toString(),
      sub: "checked in today (Managers & Employees)",
      icon: CheckCircle2,
      accent: "#2F8F82",
      clickType: "present",
    },
    {
      label: "ON LEAVE",
      value: safeApprovedLeave.toString(),
      sub: "approved leave",
      icon: AlertCircle,
      accent: "#E2604F",
      clickType: "leave",
    },
    {
      label: "REMOTE / WFH",
      value: (metrics.wfh || 4).toString(),
      sub: "working remotely",
      icon: Clock,
      accent: "#38BDF8",
      clickType: "wfh",
    },
  ];

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!isManager || !eventForm.title.trim() || !eventForm.date) return;

    const formattedLabel = formatEventDateLabel(eventForm.date, eventForm.date);
    if (!formattedLabel) {
      alert("Cannot schedule an event in the past!");
      return;
    }

    const newEv = {
      id: `e${Date.now()}`,
      title: eventForm.title,
      date: eventForm.date,
      time: eventForm.time || "3:00 PM",
      day: formattedLabel,
      tag: eventForm.tag,
      color: "#38BDF8",
    };

    const updated = [newEv, ...eventsList];
    setEventsList(updated);
    localStorage.setItem("peoplepulse_events", JSON.stringify(updated));
    setShowEventModal(false);
    setEventForm({ title: "", date: "2026-07-30", time: "03:00 PM", tag: "General" });

    // Send Notification
    try {
      const savedNotifs = localStorage.getItem("peoplepulse_notifications");
      const currentNotifs = savedNotifs ? JSON.parse(savedNotifs) : [];
      const newNotif = {
        id: Date.now(),
        title: "New Event Scheduled",
        message: `${newEv.title} has been scheduled for ${newEv.day} (${newEv.time}).`,
        createdAt: Date.now(),
        unread: true,
      };
      localStorage.setItem("peoplepulse_notifications", JSON.stringify([newNotif, ...currentNotifs]));
    } catch (e) {}

    setNotification(`Event "${eventForm.title}" scheduled successfully for ${formattedLabel}!`);
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
        {activeUpcomingEvents.map((ev) => {
          const dateLabel = formatEventDateLabel(ev.date, ev.day);
          if (!dateLabel) return null; // Past expired event!

          return (
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
                <div style={{ textAlign: "center", minWidth: 120, padding: "4px 8px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: ev.color, textTransform: "uppercase" }}>{dateLabel}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{ev.title}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-dim)" }}>{ev.tag} {ev.time ? `· ${ev.time}` : ""}</div>
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
          );
        })}

        {activeUpcomingEvents.length === 0 && (
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
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Event Date
                  <input type="date" className="nf-select" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Time
                  <input type="text" className="nf-select" placeholder="e.g. 3:00 PM" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} required />
                </label>
              </div>
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

      {/* 1. MANAGER DASHBOARD: SHOWS MY DEPARTMENT TEAM & UPCOMING EVENTS */}
      {isManager && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* MY DEPARTMENT TEAM CARD FOR LOGGED-IN MANAGER */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="nf-avatar sm" style={{ background: "#2F8F8226", color: "#2F8F82" }}>
                  <Users size={16} />
                </div>
                <div>
                  <h3 className="nf-h3" style={{ margin: 0 }}>
                    My Department Team — {currentUser?.department || "Engineering"} ({employees.filter((e) => (e.department || "").toLowerCase() === (currentUser?.department || "Engineering").toLowerCase() && e.role === "Employee").length || 10} Employees)
                  </h3>
                  <div style={{ fontSize: 11.5, color: "var(--ink-dim)", marginTop: 2 }}>
                    Employees working in your department and assigned directly to you
                  </div>
                </div>
              </div>
              <Pill tone="good">Managed by {currentUser?.name || "Manager"}</Pill>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="nf-table" style={{ width: "100%", textAlign: "left", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "var(--surface-alt)", borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: "10px 12px" }}>Employee Name</th>
                    <th style={{ padding: "10px 12px" }}>Designation</th>
                    <th style={{ padding: "10px 12px" }}>Email Address</th>
                    <th style={{ padding: "10px 12px" }}>Experience</th>
                    <th style={{ padding: "10px 12px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees
                    .filter((e) => (e.department || "").toLowerCase() === (currentUser?.department || "Engineering").toLowerCase() && e.role === "Employee")
                    .map((emp, idx) => (
                      <tr key={emp.empId || idx} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 600 }}>{emp.name}</td>
                        <td style={{ padding: "10px 12px", color: "var(--ink-dim)" }}>{emp.designation}</td>
                        <td style={{ padding: "10px 12px", color: "#2F8F82" }}>{emp.email}</td>
                        <td style={{ padding: "10px 12px", color: "var(--ink-dim)" }}>{emp.experience || "3 Years"}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "#2F8F8222", color: "#2F8F82" }}>
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div style={{ maxWidth: 700 }}>
            <UpcomingEventsCard />
          </div>
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
        </>
      )}
    </>
  );
}
