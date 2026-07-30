import React, { useState } from "react";
import {
  ChevronLeft, Mail, Phone, MapPin, Briefcase, User, ShieldCheck,
  CircleDot, FileText, Download, Gauge, Edit3, Plus, CheckCircle2, Upload, Trash2
} from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { Card } from "../common/Card";
import { Pill } from "../common/Pill";
import { AttendanceStrip, STATUS_LABEL, STATUS_COLOR } from "../common/AttendanceStrip";
import { DEPT_COLORS } from "../common/EmployeeBadge";

function MonthlyAttendanceView({ empName }) {
  const todayISO = new Date().toISOString().slice(0, 10);
  const [records] = useState(() => {
    try {
      const saved = localStorage.getItem("peoplepulse_attendance_records");
      const list = saved ? JSON.parse(saved) : [];
      const todayCheck = localStorage.getItem(`peoplepulse_checkin_${todayISO}`);
      if (todayCheck) {
        const parsed = JSON.parse(todayCheck);
        if (parsed.checkedIn || parsed.checkInTime) {
          list.push({ employee: empName, date: todayISO, status: "Present" });
        }
      }
      return list;
    } catch (e) {
      return [];
    }
  });

  const userRecords = records.filter(
    (r) => r.employee && r.employee.toLowerCase() === (empName || "").toLowerCase()
  );

  const presentDays = userRecords.filter((r) => r.status === "Present" || r.status === "P").length;
  const leaveDays = userRecords.filter((r) => r.status === "On Leave" || r.status === "Leave").length;
  const wfhDays = userRecords.filter((r) => r.status === "WFH").length;
  const totalWorkingDays = 25;
  const attendanceRate = totalWorkingDays > 0 ? Math.round((presentDays / totalWorkingDays) * 100) : 0;

  const daysInMonth = 31;
  const calendarGrid = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-07-${String(dayNum).padStart(2, "0")}`;
    const rec = userRecords.find((r) => r.date === dateStr);
    let status = rec ? rec.status : (dayNum % 7 === 0 || dayNum % 7 === 6) ? "Weekend" : "Present";
    if (dayNum === 14) status = "On Leave";
    if (dayNum === 20 || dayNum === 27) status = "WFH";
    return { dayNum, status };
  });

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h3 className="nf-h3" style={{ margin: 0 }}>July 2026 Monthly Attendance</h3>
          <div style={{ fontSize: 12, color: "var(--ink-dim)", marginTop: 2 }}>
            Daily check-in record &amp; monthly attendance compliance
          </div>
        </div>
        <div className="nf-pill good" style={{ fontWeight: 700, fontSize: 13 }}>
          {attendanceRate}% Monthly Compliance
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <div style={{ background: "var(--surface-alt)", padding: "12px 14px", borderRadius: 10, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "var(--ink-dim)", textTransform: "uppercase", fontWeight: 700 }}>Present Days</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#2F8F82", marginTop: 4 }}>{presentDays}</div>
        </div>
        <div style={{ background: "var(--surface-alt)", padding: "12px 14px", borderRadius: 10, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "var(--ink-dim)", textTransform: "uppercase", fontWeight: 700 }}>Work From Home</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#38BDF8", marginTop: 4 }}>{wfhDays}</div>
        </div>
        <div style={{ background: "var(--surface-alt)", padding: "12px 14px", borderRadius: 10, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "var(--ink-dim)", textTransform: "uppercase", fontWeight: 700 }}>Approved Leave</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#E8A33D", marginTop: 4 }}>{leaveDays}</div>
        </div>
        <div style={{ background: "var(--surface-alt)", padding: "12px 14px", borderRadius: 10, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "var(--ink-dim)", textTransform: "uppercase", fontWeight: 700 }}>Working Days</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--accent-2)", marginTop: 4 }}>{totalWorkingDays}</div>
        </div>
      </div>
    </Card>
  );
}

export function ProfileModule({ emp, back, onUpdateEmp, currentUser }) {
  const targetEmp = (currentUser && currentUser.role === "Employee") ? currentUser : (emp || currentUser);
  const [profileEmp, setProfileEmp] = useState(targetEmp);

  const isOwner = currentUser && (
    (currentUser.empId && currentUser.empId === profileEmp.empId) ||
    (currentUser.email && currentUser.email === profileEmp.email) ||
    (currentUser.name && currentUser.name === profileEmp.name)
  );

  const isManagerOrAdmin = currentUser && (currentUser.role === "Manager" || currentUser.role === "Admin" || currentUser.department === "HR");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const [editForm, setEditForm] = useState({
    name: profileEmp.name,
    email: profileEmp.email,
    phone: profileEmp.phone,
    location: profileEmp.location,
  });

  const [summaryText, setSummaryText] = useState(
    profileEmp.summaryText ||
    "Consistently meets deadlines, demonstrates strong collaboration, and has shown steady improvement in technical delivery this quarter."
  );

  const [newSkill, setNewSkill] = useState({ name: "", level: 4 });
  const [newDoc, setNewDoc] = useState({ title: "", fileName: "" });

  const isTargetManager = profileEmp.role === "Manager" || (currentUser && currentUser.role === "Manager" && (!emp || emp.role === "Manager"));
  const tabs = isTargetManager
    ? ["Attendance", "Leave", "Performance", "Skills", "Documents"]
    : ["Overview", "Attendance", "Leave", "Performance", "Skills", "Documents"];

  const [tab, setTab] = useState(isTargetManager ? "Attendance" : "Overview");
  const color = DEPT_COLORS[profileEmp.department] || "#2F8F82";

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!isOwner) return;
    const updated = {
      ...profileEmp,
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      location: editForm.location,
      initials: editForm.name.split(" ").map((p) => p[0]).slice(0, 2).join(""),
    };
    setProfileEmp(updated);
    if (onUpdateEmp) onUpdateEmp(updated);
    setShowEditModal(false);
    setNotification("Profile details updated successfully!");
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveSummary = (e) => {
    e.preventDefault();
    const updated = { ...profileEmp, summaryText };
    setProfileEmp(updated);
    if (onUpdateEmp) onUpdateEmp(updated);
    setShowSummaryModal(false);
    setNotification("Performance Summary updated successfully!");
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!isOwner || !newSkill.name.trim()) return;
    const updatedSkills = [...(profileEmp.skills || []), { name: newSkill.name, level: Number(newSkill.level) }];
    const updated = { ...profileEmp, skills: updatedSkills };
    setProfileEmp(updated);
    if (onUpdateEmp) onUpdateEmp(updated);
    setShowSkillModal(false);
    setNewSkill({ name: "", level: 4 });
    setNotification(`Added skill "${newSkill.name}"!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDeleteSkill = (skillName) => {
    if (!isOwner) return;
    const updatedSkills = profileEmp.skills.filter((s) => s.name !== skillName);
    const updated = { ...profileEmp, skills: updatedSkills };
    setProfileEmp(updated);
    if (onUpdateEmp) onUpdateEmp(updated);
    setNotification(`Removed skill "${skillName}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUploadDoc = (e) => {
    e.preventDefault();
    if (!isOwner || !newDoc.title.trim()) return;
    const docName = newDoc.title;
    const updatedDocs = [...(profileEmp.documents || ["Resume", "Offer Letter", "ID Proof", "Certificates"]), docName];
    const updated = { ...profileEmp, documents: updatedDocs };
    setProfileEmp(updated);
    if (onUpdateEmp) onUpdateEmp(updated);
    setShowDocModal(false);
    setNewDoc({ title: "", fileName: "" });
    setNotification(`Uploaded "${docName}"!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDeleteDoc = (docName) => {
    if (!isOwner) return;
    const currentDocs = profileEmp.documents || ["Resume", "Offer Letter", "ID Proof", "Certificates"];
    const updatedDocs = currentDocs.filter((d) => d !== docName);
    const updated = { ...profileEmp, documents: updatedDocs };
    setProfileEmp(updated);
    if (onUpdateEmp) onUpdateEmp(updated);
    setNotification(`Deleted document "${docName}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownloadDoc = (docName) => {
    const fileContent = `PEOPLEPULSE HR PORTAL - OFFICIAL DOCUMENT\nDocument: ${docName}\nEmployee: ${profileEmp.name}\n`;
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${docName.replace(/\s+/g, "_")}_${profileEmp.empId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const docs = profileEmp.documents || ["Resume", "Offer Letter", "ID Proof", "Certificates"];

  return (
    <>
      <button className="nf-back" onClick={back}><ChevronLeft size={15} /> Back</button>

      {notification && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      <Card className="nf-profile-head">
        <div className="nf-badge-stripe" style={{ background: color, position: "absolute", top: 0, left: 0, right: 0, height: 6, borderRadius: "14px 14px 0 0" }} />
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", paddingTop: 8 }}>
          <div className="nf-avatar lg" style={{ background: `${color}26`, color }}>{profileEmp.initials}</div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <h2 className="nf-h2" style={{ margin: 0 }}>{profileEmp.name}</h2>
              <Pill tone={profileEmp.status === "Active" ? "good" : "warn"}>{profileEmp.status}</Pill>
              {isOwner && (
                <button className="nf-btn ghost sm" onClick={() => setShowEditModal(true)} style={{ marginLeft: 6 }}>
                  <Edit3 size={13} /> Edit Profile
                </button>
              )}
            </div>
            <div style={{ color: "var(--ink-dim)", fontSize: 13.5 }}>{profileEmp.designation} · {profileEmp.department}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 12.5, marginTop: 4, color: "var(--ink-dim)" }}>{profileEmp.empId}</div>
          </div>
          <div className="nf-profile-contact">
            <div><Mail size={13} /> {profileEmp.email}</div>
            <div><Phone size={13} /> {profileEmp.phone}</div>
            <div><MapPin size={13} /> {profileEmp.location}</div>
            <div><Briefcase size={13} /> Joined {profileEmp.joined}</div>
          </div>
        </div>
      </Card>

      {showEditModal && isOwner && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 460, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Edit Personal Details</h3>
            <form onSubmit={handleSaveProfile} className="nf-form">
              <label>Full Name
                <input className="nf-select" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
              </label>
              <label>Email Address
                <input className="nf-select" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Phone Number
                  <input className="nf-select" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Office Location
                  <input className="nf-select" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} required />
                </label>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSummaryModal && isManagerOrAdmin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 460, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Edit Performance Summary</h3>
            <form onSubmit={handleSaveSummary} className="nf-form">
              <label>Summary Content
                <textarea
                  rows={4}
                  className="nf-select"
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  required
                />
              </label>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setShowSummaryModal(false)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Save Summary</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSkillModal && isOwner && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 400, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Add Custom Skill</h3>
            <form onSubmit={handleAddSkill} className="nf-form">
              <label>Skill Name
                <input className="nf-select" placeholder="e.g. Python, Docker" value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} required />
              </label>
              <label>Proficiency Rating
                <select className="nf-select" value={newSkill.level} onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}>
                  <option value={5}>★★★★★ (5 - Expert)</option>
                  <option value={4}>★★★★☆ (4 - Advanced)</option>
                  <option value={3}>★★★☆☆ (3 - Intermediate)</option>
                </select>
              </label>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setShowSkillModal(false)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Add Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDocModal && isOwner && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 440, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Upload Document</h3>
            <form onSubmit={handleUploadDoc} className="nf-form">
              <label>Document Title / Type
                <input className="nf-select" placeholder="e.g. AWS Certification" value={newDoc.title} onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })} required />
              </label>
              <label style={{ cursor: "pointer", display: "block" }}>Select File
                <input type="file" required style={{ display: "block", marginTop: 4, fontSize: 13 }} onChange={(e) => setNewDoc({ ...newDoc, fileName: e.target.files[0]?.name || "" })} />
              </label>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setShowDocModal(false)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="nf-tabs">
        {tabs.map((t) => (
          <button key={t} className={`nf-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="nf-grid-2">
          <Card>
            <h3 className="nf-h3">Reporting line</h3>
            <div className="nf-badge-row" style={{ marginTop: 8 }}><User size={13} /> Reports to {profileEmp.manager}</div>
            <div className="nf-badge-row"><Briefcase size={13} /> {profileEmp.experience} experience</div>
            <div className="nf-badge-row"><ShieldCheck size={13} /> {profileEmp.type}</div>
          </Card>
          <Card>
            <h3 className="nf-h3">Recent activity</h3>
            <ul className="nf-activity">
              <li><CircleDot size={10} /> Completed "Build Login Module" review</li>
              <li><CircleDot size={10} /> Checked in at 09:02 AM</li>
              <li><CircleDot size={10} /> Applied for medical leave</li>
            </ul>
          </Card>
        </div>
      )}

      {tab === "Attendance" && (
        <MonthlyAttendanceView empName={profileEmp.name} />
      )}

      {tab === "Leave" && (
        <Card>
          <h3 className="nf-h3">Leave balance</h3>
          <div className="nf-grid-3" style={{ marginTop: 10 }}>
            {[["Casual", 6], ["Medical", 8], ["Earned", 12]].map(([type, n]) => (
              <div key={type} className="nf-leave-balance">
                <div className="nf-eyebrow">{type}</div>
                <div className="nf-stat-value" style={{ fontSize: 26 }}>{n}<span style={{ fontSize: 13, color: "var(--ink-dim)" }}> days left</span></div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Performance" && (
        <PerformanceCard
          emp={profileEmp}
          summaryText={summaryText}
          isManagerOrAdmin={isManagerOrAdmin}
          onEditSummary={() => setShowSummaryModal(true)}
        />
      )}

      {tab === "Skills" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 className="nf-h3" style={{ margin: 0 }}>Skill matrix</h3>
            {isOwner && (
              <button className="nf-btn primary sm" onClick={() => setShowSkillModal(true)}>
                <Plus size={13} /> Add Skill
              </button>
            )}
          </div>
          <div className="nf-skills">
            {profileEmp.skills.map((s) => (
              <div key={s.name} className="nf-skill-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>{s.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="nf-stars">{"★".repeat(s.level)}{"☆".repeat(5 - s.level)}</span>
                  {isOwner && (
                    <button className="nf-btn ghost sm danger" style={{ padding: "3px 6px" }} onClick={() => handleDeleteSkill(s.name)}>
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Documents" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 className="nf-h3" style={{ margin: 0 }}>Documents</h3>
            {isOwner && (
              <button className="nf-btn primary sm" onClick={() => setShowDocModal(true)}>
                <Upload size={13} /> Upload Document
              </button>
            )}
          </div>
          <div className="nf-doclist">
            {docs.map((d) => (
              <div key={d} className="nf-doc-row">
                <span><FileText size={14} /> {d}</span>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <button className="nf-btn ghost sm" onClick={() => handleDownloadDoc(d)}>
                    <Download size={13} /> Download
                  </button>
                  {isOwner && (
                    <button className="nf-btn ghost sm danger" style={{ padding: "4px 8px" }} onClick={() => handleDeleteDoc(d)}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}

function PerformanceCard({ emp, summaryText, isManagerOrAdmin, onEditSummary }) {
  const data = Object.entries(emp.perf).map(([k, v]) => ({ subject: k, value: v, full: 10 }));
  const overall = (Object.values(emp.perf).reduce((a, b) => a + b, 0) / Object.values(emp.perf).length).toFixed(1);

  return (
    <div className="nf-grid-2">
      <Card>
        <h3 className="nf-h3">Quarterly ratings — {emp.name}</h3>
        <ResponsiveContainer width="100%" height={230}>
          <RadarChart data={data} outerRadius={80}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--ink-dim)", fontSize: 11 }} />
            <Radar dataKey="value" stroke="#E8A33D" fill="#E8A33D" fillOpacity={0.35} />
          </RadarChart>
        </ResponsiveContainer>
        <div style={{ textAlign: "center", marginTop: 4 }}>
          <span className="nf-stars" style={{ fontSize: 18 }}>{"★".repeat(Math.round(overall / 2))}{"☆".repeat(5 - Math.round(overall / 2))}</span>
          <div style={{ fontSize: 12.5, color: "var(--ink-dim)" }}>Overall {overall}/10 · {overall >= 8 ? "Excellent Performer" : overall >= 6 ? "Solid Performer" : "Needs Support"}</div>
        </div>
      </Card>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 className="nf-h3" style={{ margin: 0 }}>Performance Summary</h3>
          {isManagerOrAdmin && (
            <button className="nf-btn ghost sm" onClick={onEditSummary}>
              <Edit3 size={13} /> Edit Summary
            </button>
          )}
        </div>
        <p className="nf-summary">
          <Gauge size={14} /> {summaryText}
        </p>
        <h3 className="nf-h3" style={{ marginTop: 18 }}>Score breakdown</h3>
        {Object.entries(emp.perf).map(([k, v]) => (
          <div key={k} className="nf-bar-row">
            <span>{k}</span>
            <div className="nf-bar-track"><div className="nf-bar-fill" style={{ width: `${v * 10}%` }} /></div>
            <span className="nf-mono">{v}/10</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
