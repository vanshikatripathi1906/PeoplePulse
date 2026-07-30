import React, { useState } from "react";
import { Edit3, CheckCircle2, ShieldAlert, Star } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";
import { DEPT_COLORS } from "../common/EmployeeBadge";
import { updateEmployeeAPI } from "../../services/api";

export function generatePerformanceSummary(tech, comm, lead, stars) {
  const t = Number(tech) || 7;
  const c = Number(comm) || 7;
  const l = Number(lead) || 7;
  const avg = ((t + c + l) / 3).toFixed(1);
  const s = Number(stars) || Math.min(5, Math.max(1, Math.round(avg / 2)));

  if (s >= 5 || avg >= 8.5) {
    return `Performance Review: Exceptional ${s}-star high performer! Exceeds expectations in technical delivery (${t}/10) and communication (${c}/10). Recommended for annual merit award and leadership track.`;
  } else if (s >= 4 || avg >= 7.0) {
    return `Performance Review: Strong ${s}-star contributor! Demonstrates solid execution (${t}/10) and reliable team leadership (${l}/10). Consistent high-value team asset.`;
  } else if (s >= 3 || avg >= 5.5) {
    return `Performance Review: Dependable ${s}-star rating. Meets core responsibilities in technical tasks (${t}/10) with steady communication (${c}/10). Recommended for targeted skill enhancement.`;
  } else {
    return `Performance Review: ${s}-star performance review. Identified areas for growth in technical execution (${t}/10) and leadership alignment (${l}/10). Mentorship plan active.`;
  }
}

export function PerformanceModule({ role, employees = [], onUpdateEmp, currentUser }) {
  const [editingEmp, setEditingEmp] = useState(null);
  const [perfForm, setPerfForm] = useState({ Technical: 8, Communication: 8, Leadership: 7, stars: 4 });
  const [notification, setNotification] = useState(null);

  const isManager = role === "Manager";
  const isEmployee = role === "Employee";

  // Filter performance list strictly by excluding Admin (Aman Verma)
  let displayEmployees = (employees || []).filter(
    (e) => e.role !== "Admin" && e.name !== "Aman Verma"
  );
  if (isEmployee && currentUser) {
    displayEmployees = displayEmployees.filter(
      (e) =>
        (e.email && currentUser.email && e.email.toLowerCase() === currentUser.email.toLowerCase()) ||
        (e.name && currentUser.name && e.name.toLowerCase() === currentUser.name.toLowerCase()) ||
        (e.empId && currentUser.empId && e.empId === currentUser.empId)
    );
  } else if (role === "Manager" && currentUser?.department) {
    displayEmployees = displayEmployees.filter(
      (e) => e.department?.toLowerCase() === currentUser.department?.toLowerCase()
    );
  }

  const handleOpenEdit = (emp) => {
    if (!isManager) return;
    const t = emp.perf?.Technical || 8;
    const c = emp.perf?.Communication || 8;
    const l = emp.perf?.Leadership || 7;
    const calculatedStars = Math.min(5, Math.max(1, Math.round((t + c + l) / 6)));
    const stars = emp.perf?.stars || calculatedStars;

    setEditingEmp(emp);
    setPerfForm({
      Technical: t,
      Communication: c,
      Leadership: l,
      stars: stars,
    });
  };

  const handleSavePerf = async (e) => {
    e.preventDefault();
    if (!editingEmp) return;

    const t = Number(perfForm.Technical);
    const c = Number(perfForm.Communication);
    const l = Number(perfForm.Leadership);
    const stars = Number(perfForm.stars);
    const perfSummary = generatePerformanceSummary(t, c, l, stars);

    const updatedPerf = {
      ...editingEmp.perf,
      Technical: t,
      Communication: c,
      Leadership: l,
      stars: stars,
      aiSummary: perfSummary,
    };

    const updatedEmp = { ...editingEmp, perf: updatedPerf };

    try {
      const targetId = editingEmp._id || editingEmp.id || editingEmp.empId;
      await updateEmployeeAPI(targetId, updatedEmp);
    } catch (err) {}

    // Send notification to employee
    try {
      const savedNotifs = localStorage.getItem("peoplepulse_notifications");
      const currentNotifs = savedNotifs ? JSON.parse(savedNotifs) : [];
      const newNotif = {
        id: Date.now(),
        title: "Performance Rating Updated",
        message: `Your performance rating was updated to ${stars} stars by ${role}.`,
        time: "Just now",
        recipient: editingEmp.name,
        unread: true,
      };
      localStorage.setItem("peoplepulse_notifications", JSON.stringify([newNotif, ...currentNotifs]));
    } catch (err) {}

    if (onUpdateEmp) {
      onUpdateEmp(updatedEmp);
    }

    setEditingEmp(null);
    setNotification(`Updated performance evaluation for ${editingEmp.name}!`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <>
      <SectionTitle title="Performance Evaluation" />

      {notification && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {editingEmp && isManager && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 460, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <h3 className="nf-h3" style={{ margin: 0 }}>Edit Performance Rating — {editingEmp.name}</h3>
            </div>
            <form onSubmit={handleSavePerf} className="nf-form">
              <label>Star Rating (1 - 5 Stars)
                <select className="nf-select" value={perfForm.stars} onChange={(e) => setPerfForm({ ...perfForm, stars: e.target.value })}>
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Exceptional)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars - Exceeds Expectations)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars - Meets Expectations)</option>
                  <option value={2}>⭐⭐ (2 Stars - Needs Improvement)</option>
                  <option value={1}>⭐ (1 Star - Critical Concern)</option>
                </select>
              </label>

              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Technical (1-10)
                  <input type="number" min={1} max={10} className="nf-select" value={perfForm.Technical} onChange={(e) => setPerfForm({ ...perfForm, Technical: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Communication (1-10)
                  <input type="number" min={1} max={10} className="nf-select" value={perfForm.Communication} onChange={(e) => setPerfForm({ ...perfForm, Communication: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Leadership (1-10)
                  <input type="number" min={1} max={10} className="nf-select" value={perfForm.Leadership} onChange={(e) => setPerfForm({ ...perfForm, Leadership: e.target.value })} required />
                </label>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setEditingEmp(null)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Save Performance Evaluation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="nf-grid-2">
        {displayEmployees.map((emp) => {
          const color = DEPT_COLORS[emp.department] || "#6C6FB0";
          const t = emp.perf?.Technical || 8;
          const c = emp.perf?.Communication || 8;
          const l = emp.perf?.Leadership || 7;
          const calculatedStars = Math.min(5, Math.max(1, Math.round((t + c + l) / 6)));
          const stars = emp.perf?.stars || calculatedStars;
          const summaryText = emp.perf?.aiSummary || generatePerformanceSummary(t, c, l, stars);

          return (
            <Card key={emp.empId || emp.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="nf-avatar" style={{ background: `${color}26`, color: color, fontWeight: 700 }}>
                    {emp.initials || "EM"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{emp.name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>{emp.designation} · {emp.department}</div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", gap: 2, justifyContent: "flex-end", marginBottom: 2 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        style={{
                          color: i < stars ? "#E8A33D" : "var(--border)",
                          fill: i < stars ? "#E8A33D" : "none",
                        }}
                      />
                    ))}
                  </div>
                  {isManager && emp.role !== "Manager" && (
                    <button className="nf-btn ghost sm" style={{ padding: "3px 8px", fontSize: 11 }} onClick={() => handleOpenEdit(emp)}>
                      <Edit3 size={12} /> Edit Rating
                    </button>
                  )}
                </div>
              </div>


              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                <div style={{ background: "var(--surface-alt)", padding: "8px 10px", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>Technical</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2, color: "#38BDF8" }}>{t} / 10</div>
                </div>
                <div style={{ background: "var(--surface-alt)", padding: "8px 10px", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>Communication</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2, color: "#2F8F82" }}>{c} / 10</div>
                </div>
                <div style={{ background: "var(--surface-alt)", padding: "8px 10px", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>Leadership</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2, color: "#E8A33D" }}>{l} / 10</div>
                </div>
              </div>
            </Card>
          );
        })}

        {displayEmployees.length === 0 && (
          <div className="nf-empty">No performance records found.</div>
        )}
      </div>
    </>
  );
}
