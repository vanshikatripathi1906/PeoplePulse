import React, { useState, useEffect } from "react";
import { Plus, Building2, ChevronDown, CheckCircle2, Edit3, Trash2 } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";

const EXTRA_DEPARTMENTS = [
  { name: "Product & Design", head: "Kavya Menon", count: 28, avgExp: "4.5 Years", projects: 7 },
  { name: "Legal & Compliance", head: "Rohan Kapoor", count: 18, avgExp: "6.0 Years", projects: 3 },
  { name: "IT Infrastructure", head: "Siddharth Jain", count: 24, avgExp: "5.1 Years", projects: 5 },
];

export function DepartmentsModule({ role, departments, currentUser }) {
  const [deptList, setDeptList] = useState(() => {
    const saved = localStorage.getItem("peoplepulse_departments");
    return saved ? JSON.parse(saved) : departments;
  });

  useEffect(() => {
    localStorage.setItem("peoplepulse_departments", JSON.stringify(deptList));
  }, [deptList]);

  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [notification, setNotification] = useState(null);

  const isManagerOrAdmin = role === "Admin" || role === "Manager";

  // Filter department cards for Manager role: show only Manager's concerned department
  const displayDepartments = role === "Manager" && currentUser?.department
    ? deptList.filter((d) => d.name.toLowerCase() === currentUser.department.toLowerCase() || d.name === "Engineering")
    : deptList;

  const [deptForm, setDeptForm] = useState({
    name: "",
    head: "",
    count: 10,
    avgExp: "3.5 Years",
    projects: 4,
  });

  const handleLoadMore = () => {
    setDeptList([...deptList, ...EXTRA_DEPARTMENTS]);
    setHasLoadedMore(true);
  };

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
    if (!isManagerOrAdmin) return;
    const updated = deptList.filter((d) => d.name !== deptName);
    setDeptList(updated);
    setNotification(`Deleted department "${deptName}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <>
      <SectionTitle
        title={role === "Manager" ? `My Department — ${currentUser?.department || "Engineering"}` : "Department Structure"}
        action={
          role === "Admin" ? (
            <button className="nf-btn primary" onClick={() => setShowAddModal(true)}>
              <Plus size={14} /> Add department
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
              <label>Department Head
                <input className="nf-select" placeholder="e.g. Aman Verma" value={deptForm.head} onChange={(e) => setDeptForm({ ...deptForm, head: e.target.value })} required />
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
              <label>Department Head
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
        {displayDepartments.map((d) => (
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
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{d.count}</div>
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
        ))}
      </div>

      {role === "Admin" && !hasLoadedMore && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button className="nf-btn ghost" onClick={handleLoadMore}>
            <ChevronDown size={14} /> Load 3 more departments
          </button>
        </div>
      )}
    </>
  );
}
