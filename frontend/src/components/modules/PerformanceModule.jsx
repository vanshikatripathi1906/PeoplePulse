import React, { useState } from "react";
import { Edit3, CheckCircle2, ShieldAlert, Sparkles, Star } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";
import { DEPT_COLORS } from "../common/EmployeeBadge";

export function generateAISummary(tech, comm, lead, stars) {
  const t = Number(tech) || 7;
  const c = Number(comm) || 7;
  const l = Number(lead) || 7;
  const avg = ((t + c + l) / 3).toFixed(1);
  const s = Number(stars) || Math.min(5, Math.max(1, Math.round(avg / 2)));

  if (s >= 5 || avg >= 8.5) {
    return `AI Review: Exceptional ${s}-star high performer! Exceeds expectations in technical delivery (${t}/10) and communication (${c}/10). Recommended for annual merit award and leadership track.`;
  } else if (s >= 4 || avg >= 7.0) {
    return `AI Review: Strong ${s}-star contributor! Demonstrates solid execution (${t}/10) and reliable team leadership (${l}/10). Consistent high-value team asset.`;
  } else if (s >= 3 || avg >= 5.5) {
    return `AI Review: Dependable ${s}-star rating. Meets core responsibilities in technical tasks (${t}/10) with steady communication (${c}/10). Recommended for targeted skill enhancement.`;
  } else {
    return `AI Review: ${s}-star performance review. Identified areas for growth in technical execution (${t}/10) and leadership alignment (${l}/10). Mentorship plan active.`;
  }
}

export function PerformanceModule({ role, employees, onUpdateEmp }) {
  const [editingEmp, setEditingEmp] = useState(null);
  const [perfForm, setPerfForm] = useState({ Technical: 8, Communication: 8, Leadership: 7, stars: 4 });
  const [notification, setNotification] = useState(null);

  const isManagerOrAdmin = role === "Manager" || role === "Admin";
  const activeEmployeesList = employees || [];

  const handleOpenEdit = (emp) => {
    if (!isManagerOrAdmin) return;
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

  const handleSavePerf = (e) => {
    e.preventDefault();
    if (!editingEmp) return;

    const t = Number(perfForm.Technical);
    const c = Number(perfForm.Communication);
    const l = Number(perfForm.Leadership);
    const stars = Number(perfForm.stars);
    const aiSummary = generateAISummary(t, c, l, stars);

    const updatedPerf = {
      ...editingEmp.perf,
      Technical: t,
      Communication: c,
      Leadership: l,
      stars: stars,
      aiSummary: aiSummary,
    };

    const updated = {
      ...editingEmp,
      perf: updatedPerf,
      summaryText: aiSummary,
    };

    if (onUpdateEmp) onUpdateEmp(updated);
    setEditingEmp(null);
    setNotification(`Updated performance ratings & AI summary for ${editingEmp.name}!`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <>
      <SectionTitle
        eyebrow="GROWTH & EVALUATION"
        title="Performance Reviews"
        action={
          !isManagerOrAdmin && (
            <div className="nf-pill nf-pill-default" style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <ShieldAlert size={12} /> Rating Modification (Admin / Manager Mode Only)
            </div>
          )
        }
      />

      {notification && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {/* Edit Performance Modal for Manager & Admin */}
      {editingEmp && isManagerOrAdmin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 460, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Sparkles size={18} style={{ color: "#E8A33D" }} />
              <h3 className="nf-h3" style={{ margin: 0 }}>Edit Performance &amp; AI Rating — {editingEmp.name}</h3>
            </div>
            <form onSubmit={handleSavePerf} className="nf-form">
              <label>Star Rating (1 - 5 Stars)
                <select
                  className="nf-select"
                  value={perfForm.stars}
                  onChange={(e) => setPerfForm({ ...perfForm, stars: Number(e.target.value) })}
                  required
                >
                  <option value={5}>5 Stars — Exceptional Performance</option>
                  <option value={4}>4 Stars — Exceeds Expectations</option>
                  <option value={3}>3 Stars — Meets Expectations</option>
                  <option value={2}>2 Stars — Needs Improvement</option>
                  <option value={1}>1 Star — Critical Review Required</option>
                </select>
              </label>

              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Technical (1-10)
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="nf-select"
                    value={perfForm.Technical}
                    onChange={(e) => setPerfForm({ ...perfForm, Technical: e.target.value })}
                    required
                  />
                </label>
                <label style={{ flex: 1 }}>Communication (1-10)
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="nf-select"
                    value={perfForm.Communication}
                    onChange={(e) => setPerfForm({ ...perfForm, Communication: e.target.value })}
                    required
                  />
                </label>
                <label style={{ flex: 1 }}>Leadership (1-10)
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="nf-select"
                    value={perfForm.Leadership}
                    onChange={(e) => setPerfForm({ ...perfForm, Leadership: e.target.value })}
                    required
                  />
                </label>
              </div>

              <div style={{ background: "var(--surface-alt)", padding: 12, borderRadius: 10, fontSize: 12, color: "var(--ink-dim)", marginTop: 10, border: "1px dashed var(--border)" }}>
                <div style={{ fontWeight: 700, color: "var(--accent)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <Sparkles size={13} /> Live AI Summary Preview:
                </div>
                {generateAISummary(perfForm.Technical, perfForm.Communication, perfForm.Leadership, perfForm.stars)}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setEditingEmp(null)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Save &amp; Generate AI Summary</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="nf-grid-3" style={{ gap: 24 }}>
        {activeEmployeesList.map((e) => {
          const perfObj = e.perf || { Technical: 8, Communication: 8, Leadership: 7 };
          const t = perfObj.Technical || 8;
          const c = perfObj.Communication || 8;
          const l = perfObj.Leadership || 7;
          const overall = ((t + c + l) / 3).toFixed(1);
          const starsCount = perfObj.stars || Math.min(5, Math.max(1, Math.round(overall / 2)));
          const color = DEPT_COLORS[e.department] || "#2F8F82";

          return (
            <Card key={e.id || e.empId} style={{ padding: 22 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="nf-avatar" style={{ background: `${color}26`, color }}>{e.initials}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{e.name}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>{e.designation}</div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, fontFamily: "'Inter', sans-serif", color: "var(--ink-dim)", marginTop: 1 }}>{e.empId}</div>
                    </div>
                  </div>
                  {isManagerOrAdmin && (
                    <button className="nf-btn ghost sm" style={{ padding: "4px 8px" }} onClick={() => handleOpenEdit(e)}>
                      <Edit3 size={13} /> Edit
                    </button>
                  )}
                </div>

                <div style={{ marginTop: 14 }}>
                  <div className="nf-bar-row">
                    <span>Technical</span>
                    <div className="nf-bar-track"><div className="nf-bar-fill" style={{ width: `${t * 10}%` }} /></div>
                    <span className="nf-mono">{t}</span>
                  </div>
                  <div className="nf-bar-row">
                    <span>Communication</span>
                    <div className="nf-bar-track"><div className="nf-bar-fill" style={{ width: `${c * 10}%` }} /></div>
                    <span className="nf-mono">{c}</span>
                  </div>
                  <div className="nf-bar-row">
                    <span>Leadership</span>
                    <div className="nf-bar-track"><div className="nf-bar-fill" style={{ width: `${l * 10}%` }} /></div>
                    <span className="nf-mono">{l}</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                  <span className="nf-stars" style={{ color: "#E8A33D", fontSize: 16 }}>
                    {"★".repeat(starsCount)}{"☆".repeat(5 - starsCount)}
                  </span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "14.5px", color: "var(--accent-2)" }}>
                    {overall}/10
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
