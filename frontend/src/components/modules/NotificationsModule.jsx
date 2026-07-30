import React, { useState, useEffect } from "react";
import { Bell, CheckCircle2, AlertCircle, Info, Calendar, Clock, Trash2, Check, X } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";
import { formatRelativeTime } from "./DashboardModule";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "New User Access Request",
    message: "Karan Malhotra (karan.malhotra@peoplepulse.co) requested access to join PeoplePulse as QA Lead.",
    createdAt: Date.now() - 5 * 60 * 1000,
    type: "warning",
    unread: true,
    recipient: "Admin",
    accessRequest: {
      name: "Karan Malhotra",
      email: "karan.malhotra@peoplepulse.co",
      designation: "QA Lead",
      department: "Engineering",
      empId: "EMP-9021",
    },
  },
  { id: 2, title: "Leave Request Approved", message: "Your leave application for 28 Jul has been approved by Rahul Sharma.", createdAt: Date.now() - 10 * 60 * 1000, type: "success", read: false, recipient: "Vanshika Tripathi" },
  { id: 3, title: "New Task Assigned", message: "Aman Verma assigned you 'Redesign employee card'. Due date: 28 Jul.", createdAt: Date.now() - 60 * 60 * 1000, type: "info", read: false, recipient: "Vanshika Tripathi" },
  { id: 4, title: "Upcoming Townhall Meeting", message: "Annual Townhall is scheduled for tomorrow at 04:00 PM in Orion Boardroom.", createdAt: Date.now() - 180 * 60 * 1000, type: "warning", read: true },
  { id: 5, title: "Performance Rating Updated", message: "Your performance evaluation has been updated by Manager.", createdAt: Date.now() - 24 * 60 * 60 * 1000, type: "info", read: true, recipient: "Vanshika Tripathi" },
];

export function NotificationsModule({ role, currentUser, onApprovePending, onRejectPending }) {
  const [rawNotifs, setRawNotifs] = useState(() => {
    const saved = localStorage.getItem("peoplepulse_notifications");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem("peoplepulse_notifications", JSON.stringify(rawNotifs));
  }, [rawNotifs]);

  const notifications = rawNotifs.filter((n) => {
    if (n.department) {
      if (n.department === "All Departments" || n.department === "All") return true;
      if (currentUser?.department && currentUser.department.toLowerCase() === n.department.toLowerCase()) return true;
      if (role === "Admin") return true;
      return false;
    }
    if (!n.recipient) return true;
    const recipientLower = (n.recipient || "").toLowerCase();
    const currentNameLower = (currentUser?.name || "").toLowerCase();
    const currentEmailLower = (currentUser?.email || "").toLowerCase();
    const currentRoleLower = (role || "").toLowerCase();

    return (
      (currentNameLower && recipientLower === currentNameLower) ||
      (currentEmailLower && recipientLower === currentEmailLower) ||
      (currentRoleLower && recipientLower === currentRoleLower) ||
      (role === "Admin" && recipientLower === "admin")
    );
  });

  const handleApproveAccess = (item) => {
    if (onApprovePending && item.accessRequest) {
      onApprovePending(item.accessRequest);
    }
    const updated = rawNotifs.map((n) => {
      if (n.id === item.id) {
        return {
          ...n,
          read: true,
          status: "Approved",
          message: `Access approved for ${item.accessRequest?.name || "User"}. Employee added to live database.`,
        };
      }
      return n;
    });
    setRawNotifs(updated);
    setNotificationMessage(`Approved access request for ${item.accessRequest?.name || "User"}!`);
    setTimeout(() => setNotificationMessage(null), 3500);
  };

  const handleRejectAccess = (item) => {
    if (onRejectPending && item.accessRequest) {
      onRejectPending(item.accessRequest.email || item.id);
    }
    const updated = rawNotifs.map((n) => {
      if (n.id === item.id) {
        return {
          ...n,
          read: true,
          status: "Rejected",
          message: `Access request for ${item.accessRequest?.name || "User"} was rejected.`,
        };
      }
      return n;
    });
    setRawNotifs(updated);
    setNotificationMessage(`Rejected access request for ${item.accessRequest?.name || "User"}`);
    setTimeout(() => setNotificationMessage(null), 3500);
  };

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

      {notificationMessage && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {notificationMessage}
        </div>
      )}

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
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1 }}>
                <div style={{ marginTop: 2 }}>{getIcon(item.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: item.read ? 600 : 700, fontSize: 14 }}>{item.title}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 4 }}>{item.message}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-dim)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={11} /> {formatRelativeTime(item.createdAt || item.timestamp || item.time)}
                  </div>

                  {}
                  {role === "Admin" && item.accessRequest && !item.status && (
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button className="nf-btn primary sm" onClick={() => handleApproveAccess(item)}>
                        <Check size={13} /> Approve Access
                      </button>
                      <button className="nf-btn ghost sm danger" onClick={() => handleRejectAccess(item)}>
                        <X size={13} /> Reject Request
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                className="nf-btn ghost sm danger"
                style={{ padding: "4px 8px", marginLeft: 10 }}
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
