import React, { useState, useEffect } from "react";
import { Bell, CheckCircle2, AlertCircle, Info, Calendar, Clock, Trash2, Check } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";
import { formatRelativeTime } from "./DashboardModule";

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "Leave Request Approved", message: "Your leave application for 28 Jul has been approved by Rahul Sharma.", createdAt: Date.now() - 10 * 60 * 1000, type: "success", read: false, recipient: "Vanshika Tripathi" },
  { id: 2, title: "New Task Assigned", message: "Aman Verma assigned you 'Redesign employee card'. Due date: 28 Jul.", createdAt: Date.now() - 60 * 60 * 1000, type: "info", read: false, recipient: "Vanshika Tripathi" },
  { id: 3, title: "Upcoming Townhall Meeting", message: "Annual Townhall is scheduled for tomorrow at 04:00 PM in Orion Boardroom.", createdAt: Date.now() - 180 * 60 * 1000, type: "warning", read: true },
  { id: 4, title: "Performance Rating Updated", message: "Your performance evaluation has been updated by Manager.", createdAt: Date.now() - 24 * 60 * 60 * 1000, type: "info", read: true, recipient: "Vanshika Tripathi" },
];

export function NotificationsModule({ role, currentUser }) {
  const [rawNotifs, setRawNotifs] = useState(() => {
    const saved = localStorage.getItem("peoplepulse_notifications");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem("peoplepulse_notifications", JSON.stringify(rawNotifs));
  }, [rawNotifs]);

  // Filter notifications by recipient if role is Employee
  const notifications = role === "Employee" && currentUser?.name
    ? rawNotifs.filter(
        (n) => !n.recipient || n.recipient.toLowerCase() === currentUser.name.toLowerCase()
      )
    : rawNotifs;

  const handleDeleteOne = (id) => {
    setRawNotifs(rawNotifs.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setRawNotifs([]);
  };

  const handleMarkAllRead = () => {
    setRawNotifs(rawNotifs.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    if (type === "success") return <CheckCircle2 size={16} color="#2F8F82" />;
    if (type === "warning") return <AlertCircle size={16} color="#E8A33D" />;
    return <Info size={16} color="#3B82F6" />;
  };

  return (
    <>
      <SectionTitle
        title={role === "Employee" ? "My Notifications" : "Notifications Center"}
        action={
          notifications.length > 0 && (
            <div style={{ display: "flex", gap: 8 }}>
              <button className="nf-btn ghost sm" onClick={handleMarkAllRead}>
                <Check size={13} /> Mark All Read
              </button>
              <button className="nf-btn ghost sm danger" onClick={handleClearAll}>
                <Trash2 size={13} /> Clear All
              </button>
            </div>
          )
        }
      />

      <Card style={{ padding: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {notifications.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: "14px 16px",
                background: item.read ? "var(--surface-alt)" : "rgba(47,143,130,0.06)",
                border: item.read ? "1px solid var(--border)" : "1px solid rgba(47,143,130,0.3)",
                borderRadius: 12,
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ marginTop: 2 }}>{getIcon(item.type)}</div>
                <div>
                  <div style={{ fontWeight: item.read ? 600 : 700, fontSize: 14 }}>{item.title}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 4 }}>{item.message}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-dim)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={11} /> {formatRelativeTime(item.createdAt || item.timestamp || item.time)}
                  </div>
                </div>
              </div>

              <button
                className="nf-btn ghost sm danger"
                style={{ padding: "4px 8px" }}
                title="Dismiss"
                onClick={() => handleDeleteOne(item.id)}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="nf-empty" style={{ padding: 24 }}>No notifications at this time.</div>
          )}
        </div>
      </Card>
    </>
  );
}
