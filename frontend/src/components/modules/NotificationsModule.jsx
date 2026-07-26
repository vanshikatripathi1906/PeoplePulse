import React, { useState, useEffect } from "react";
import { Bell, CheckCircle2, AlertCircle, Info, Calendar, Clock, Trash2, Check } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "Leave Request Approved", message: "Your sick leave application for 28 Jul has been approved by Rahul Sharma.", time: "10 mins ago", type: "success", read: false },
  { id: 2, title: "New Task Assigned", message: "Aman Verma assigned you 'Redesign employee card'. Due date: 28 Jul.", time: "1 hour ago", type: "info", read: false },
  { id: 3, title: "Upcoming Townhall Meeting", message: "Annual Townhall is scheduled for tomorrow at 04:00 PM in Orion Boardroom.", time: "3 hours ago", type: "warning", read: true },
  { id: 4, title: "Hardware Asset Issued", message: "MacBook Pro 16\" (S/N: MBP-2024-8819) has been assigned to your profile.", time: "Yesterday", type: "info", read: true },
];

export function NotificationsModule() {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("peoplepulse_notifications");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem("peoplepulse_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const handleDeleteOne = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    if (type === "success") return <CheckCircle2 size={16} color="#2F8F82" />;
    if (type === "warning") return <AlertCircle size={16} color="#E8A33D" />;
    return <Info size={16} color="#3B82F6" />;
  };

  return (
    <>
      <SectionTitle
        title="Notifications"
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
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: "14px 16px",
                background: n.read ? "var(--surface)" : "var(--surface-alt)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                gap: 12,
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ marginTop: 2 }}>{getIcon(n.type)}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{n.title}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 4, lineHeight: 1.5 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-dim)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={11} /> {n.time}
                  </div>
                </div>
              </div>

              <button
                className="nf-btn ghost sm danger"
                title="Delete notification"
                style={{ padding: "4px 8px" }}
                onClick={() => handleDeleteOne(n.id)}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="nf-empty" style={{ padding: 32 }}>
              <Bell size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
              <div>No notifications left. All caught up!</div>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
