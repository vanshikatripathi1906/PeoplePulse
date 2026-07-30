import React, { useState, useEffect } from "react";
import { Plus, Building2, CheckCircle2, Edit3, Trash2 } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";

export function DepartmentsModule({ role, departments, employees = [], currentUser }) {
  const [deptList, setDeptList] = useState(() => {
    try {
      const saved = localStorage.getItem("peoplepulse_departments");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep only active departments with head assigned
          return parsed;
        }
      }
    } catch (e) {}
    return departments;
  });

  useEffect(() => {
    localStorage.setItem("peoplepulse_departments", JSON.stringify(deptList));
  }, [deptList]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [notification, setNotification] = useState(null);

  const isManagerOrAdmin = role === "Admin" || role === "Manager";

  const [deptForm, setDeptForm] = useState({
    name: "",
    head: "",
    count: 10,
    avgExp: "3.5 Years",
    projects: 4,
  });

  const getDeptEmployeeCount = (deptName) => {
    if (!employees || employees.length === 0) return null;
    const matchCount = employees.filter(
      (e) => (e.department || "").toLowerCase().trim() === deptName.toLowerCase().trim() && e.role !== "Manager" && e.role !== "Admin"
    ).length;
    return matchCount;
  };

  // Filter department cards: show ONLY active departments where employees are actually working (count > 0)
  const activeWorkingDepartments = (
    role === "Manager" && currentUser?.department
      ? deptList.filter((d) => d.name.toLowerCase() === currentUser.department.toLowerCase() || d.name === "Engineering")
      : deptList
  ).filter((d) => {
    const liveCount = getDeptEmployeeCount(d.name);
    const countToUse = liveCount !== null ? liveCount : d.count;
    return countToUse > 0;
  });

  const handleCreateDept = (e) => {
    e.preventDefault();
    if (!isManagerOrAdmin || !deptForm.name.trim()) return;

    const newDept = {
      name: deptForm.name,
      head: deptForm.head || "Unassigned",
      count: Number(deptForm.count) || 1,
      avgExp: deptForm.avgExp || "1 Year",
      projects: Number(deptForm.projects) || 1,
    };

    const updated = [newDept, ...deptList];
    setDeptList(updated);
    setShowAddModal(false);
    setDeptForm({ name: "", head: "", count: 10, avgExp: "3.5 Years", projects: 4 });
    setNotification(`Department "${newDept.name}" created successfully!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenEdit = (dept) => {
    if (!isManagerOrAdmin) return;
    setEditingDept(dept);
    setDeptForm({
      name: dept.name,
      head: dept.head,
      count: dept.count,
      avgExp: dept.avgExp,
      projects: dept.projects,
    });
  };

  const handleSaveEditDept = (e) => {
    e.preventDefault();
    if (!editingDept || !isManagerOrAdmin) return;

    const updatedList = deptList.map((d) => {
      if (d.name === editingDept.name) {
        return {
          ...d,
          name: deptForm.name,
          head: deptForm.head,
          count: Number(deptForm.count),
          avgExp: deptForm.avgExp,
          projects: Number(deptForm.projects),
        };
      }
      return d;
    });

    setDeptList(updatedList);
    setEditingDept(null);
    setNotification(`Department "${deptForm.name}" updated successfully!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDeleteDept = (deptName) => {
    if (role !== "Admin") return;
    const updated = deptList.filter((d) => d.name !== deptName);
    setDeptList(updated);
    setNotification(`Deleted department "${deptName}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <>
      <SectionTitle
        title="Departments Overview"
        action={
          role === "Admin" ? (
            <button className="nf-btn primary" onClick={() => setShowAddModal(true)}>
              <Plus size={14} /> Add Department
            </button>
          ) : null
        }
      />

      {notification && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {showAddModal && role === "Admin" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 440, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Create New Department</h3>
            <form onSubmit={handleCreateDept} className="nf-form">
              <label>Department Name
                <input className="nf-select" placeholder="e.g. AI Research" value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} required />
              </label>
              <label>Department Head / Manager
                <input className="nf-select" placeholder="e.g. Rahul Sharma" value={deptForm.head} onChange={(e) => setDeptForm({ ...deptForm, head: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Member Count
                  <input type="number" className="nf-select" value={deptForm.count} onChange={(e) => setDeptForm({ ...deptForm, count: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Active Projects
                  <input type="number" className="nf-select" value={deptForm.projects} onChange={(e) => setDeptForm({ ...deptForm, projects: e.target.value })} required />
                </label>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Create Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingDept && isManagerOrAdmin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 440, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Edit Department</h3>
            <form onSubmit={handleSaveEditDept} className="nf-form">
              <label>Department Name
                <input className="nf-select" value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} required />
              </label>
              <label>Department Head / Manager
                <input className="nf-select" value={deptForm.head} onChange={(e) => setDeptForm({ ...deptForm, head: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Member Count
                  <input type="number" className="nf-select" value={deptForm.count} onChange={(e) => setDeptForm({ ...deptForm, count: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Active Projects
                  <input type="number" className="nf-select" value={deptForm.projects} onChange={(e) => setDeptForm({ ...deptForm, projects: e.target.value })} required />
                </label>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setEditingDept(null)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="nf-grid-3">
        {activeWorkingDepartments.map((d) => {
          const liveCount = getDeptEmployeeCount(d.name);
          const displayCount = liveCount !== null ? liveCount : d.count;

          return (
            <Card key={d.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="nf-avatar sm" style={{ background: "#2F8F8226", color: "#2F8F82" }}>
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h3 className="nf-h3" style={{ margin: 0 }}>{d.name}</h3>
                    <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>Head: {d.head}</div>
                  </div>
                </div>

                {role === "Admin" && (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="nf-btn ghost sm" style={{ padding: "4px 8px" }} title="Edit Dept" onClick={() => handleOpenEdit(d)}>
                      <Edit3 size={12} />
                    </button>
                    <button className="nf-btn ghost sm danger" style={{ padding: "4px 8px" }} title="Delete Dept" onClick={() => handleDeleteDept(d.name)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 14 }}>
                <div style={{ background: "var(--surface-alt)", padding: "8px", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 10.5, color: "var(--ink-dim)" }}>Employees</div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, color: "#E8A33D" }}>{displayCount}</div>
                </div>
                <div style={{ background: "var(--surface-alt)", padding: "8px", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 10.5, color: "var(--ink-dim)" }}>Avg Exp</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{d.avgExp}</div>
                </div>
                <div style={{ background: "var(--surface-alt)", padding: "8px", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 10.5, color: "var(--ink-dim)" }}>Projects</div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, color: "#2F8F82" }}>{d.projects}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {activeWorkingDepartments.length === 0 && (
        <div className="nf-empty" style={{ padding: 30 }}>
          No active departments with working employees found.
        </div>
      )}
    </>
  );
}
