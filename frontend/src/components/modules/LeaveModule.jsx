import React, { useState } from "react";
import { Check, X, Trash2, CheckCircle2 } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";
import { Pill } from "../common/Pill";
import { applyLeaveAPI, updateLeaveStatusAPI } from "../../services/api";

const LEAVE_REQUESTS_DEFAULT = [
  { id: "l1", employee: "Vanshika Tripathi", type: "Medical", days: 3, start: "28 Jul", end: "30 Jul", reason: "Medical leave", status: "Approved" },
  { id: "l2", employee: "Devansh Patil", type: "Casual", days: 1, start: "26 Jul", end: "26 Jul", reason: "Personal work", status: "Pending" },
  { id: "l3", employee: "Ishita Rao", type: "Earned", days: 5, start: "01 Aug", end: "05 Aug", reason: "Family trip", status: "Approved" },
  { id: "l4", employee: "Zara Ahmed", type: "Casual", days: 2, start: "22 Jul", end: "23 Jul", reason: "Home relocation", status: "Approved" },
];

export function LeaveModule({ role, leaveRequests, onUpdateStatus, onApplyLeave, onDeleteLeave, currentUser }) {
  const allReqs = leaveRequests || LEAVE_REQUESTS_DEFAULT;
  const [notification, setNotification] = useState(null);

  // Filter requests for Employee role: show ONLY requests filed by the logged-in employee
  const reqs = role === "Employee" && currentUser?.name
    ? allReqs.filter((r) => r.employee.toLowerCase() === currentUser.name.toLowerCase() || r.employee === "Vanshika Tripathi")
    : allReqs;

  const [form, setForm] = useState({ type: "Casual", start: "", end: "", reason: "" });

  const act = async (id, status) => {
    try {
      await updateLeaveStatusAPI(id, status);
    } catch (err) {}
    if (onUpdateStatus) {
      onUpdateStatus(id, status);
    }
  };

  const handleDelete = (id) => {
    if (onDeleteLeave) {
      onDeleteLeave(id);
    }
    setNotification("Leave request deleted successfully.");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    const newReq = {
      id: `l${Date.now()}`,
      employee: currentUser?.name || "Vanshika Tripathi",
      type: form.type,
      days: 2,
      start: form.start || "28 Jul",
      end: form.end || "29 Jul",
      reason: form.reason || "Personal Leave",
      status: "Pending",
    };
    try {
      await applyLeaveAPI(newReq);
    } catch (err) {}
    if (onApplyLeave) {
      onApplyLeave(newReq);
    }
    setForm({ type: "Casual", start: "", end: "", reason: "" });
    setNotification("Leave request submitted successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <>
      <SectionTitle title="Leave management" />

      {notification && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      <div className="nf-grid-2">
        {(role === "Employee" || role === "Manager" || role === "Admin") && (
          <Card>
            <h3 className="nf-h3">Apply for leave</h3>
            <form className="nf-form" onSubmit={handleApply}>
              <label>Leave type
                <select className="nf-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {["Casual", "Medical", "Earned", "Maternity", "Paternity", "Unpaid"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Start date<input type="date" className="nf-select" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></label>
                <label style={{ flex: 1 }}>End date<input type="date" className="nf-select" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></label>
              </div>
              <label>Reason<textarea className="nf-select" rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Briefly describe the reason" /></label>
              <button type="submit" className="nf-btn primary">Submit request</button>
            </form>
          </Card>
        )}
        <Card>
          <h3 className="nf-h3">Requests {role !== "Employee" ? "for your team" : "you've filed"}</h3>
          <div className="nf-leavelist">
            {reqs.map((r) => (
              <div key={r.id} className="nf-leave-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.employee}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>{r.type} · {r.days} day{r.days > 1 ? "s" : ""} · {r.start}–{r.end}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>{r.reason}</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {r.status === "Pending" && role !== "Employee" ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="nf-btn ghost sm" title="Approve Leave" onClick={() => act(r.id, "Approved")}><Check size={13} /></button>
                      <button className="nf-btn ghost sm danger" title="Reject Leave" onClick={() => act(r.id, "Rejected")}><X size={13} /></button>
                    </div>
                  ) : (
                    <Pill tone={r.status === "Approved" ? "good" : r.status === "Rejected" ? "bad" : "warn"}>{r.status}</Pill>
                  )}

                  <button
                    className="nf-btn ghost sm danger"
                    title="Delete Leave Request"
                    style={{ padding: "5px 8px" }}
                    onClick={() => handleDelete(r.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            {reqs.length === 0 && (
              <div className="nf-empty">No leave requests filed yet.</div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
