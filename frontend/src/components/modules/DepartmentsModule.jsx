import React, { useState, useEffect } from "react";
import { Plus, Building2, CheckCircle2, Edit3, Trash2, Users } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";

const DEFAULT_ACTIVE_DEPARTMENTS = [
  { name: "Engineering", head: "Rahul Sharma", count: 9 },
  { name: "Product", head: "Priya Nair", count: 9 },
  { name: "HR", head: "Sneha Gupta", count: 9 },
  { name: "Finance", head: "Rohan Kapoor", count: 9 },
  { name: "Marketing", head: "Ananya Sen", count: 9 },
];

export function DepartmentsModule({ role, departments, employees = [], currentUser }) {
  const [deptList, setDeptList] = useState(() => {
    try {
      const saved = localStorage.getItem("peoplepulse_departments");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          return parsed;
        }
      }
    } catch (e) {}
    return (departments && departments.length >= 5) ? departments : DEFAULT_ACTIVE_DEPARTMENTS;
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
    count: 9,
  });

  const getDeptEmployeeCount = (deptName) => {
    if (!employees || employees.length === 0) return null;
    const matchCount = employees.filter(
      (e) => (e.department || "").toLowerCase().trim() === deptName.toLowerCase().trim() && e.role !== "Manager" && e.role !== "Admin"
    ).length;
    return matchCount;
  };

  // Filter department cards: show ONLY active departments where employees are actually working
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
    };

    const updated = [newDept, ...deptList];
    setDeptList(updated);
    setShowAddModal(false);
    setDeptForm({ name: "", head: "", count: 9 });
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

  // Extract the 5 primary Department Managers (1 per department)
  const departmentManagers = (employees && employees.length > 0)
    ? employees.filter((e) => e.role === "Manager" || e.name === "Rahul Sharma" || e.name === "Priya Nair" || e.name === "Sneha Gupta" || e.name === "Rohan Kapoor" || e.name === "Ananya Sen")
    : [
        { name: "Rahul Sharma", designation: "Senior Engineering Manager", department: "Engineering", email: "managerpeoplepulse@gmail.com" },
        { name: "Priya Nair", designation: "Product Head", department: "Product", email: "priya.nair@peoplepulse.co" },
        { name: "Sneha Gupta", designation: "HR Director", department: "HR", email: "sneha.gupta@peoplepulse.co" },
        { name: "Rohan Kapoor", designation: "Finance Director", department: "Finance", email: "rohan.kapoor@peoplepulse.co" },
        { name: "Ananya Sen", designation: "Marketing Director", department: "Marketing", email: "ananya.sen@peoplepulse.co" },
      ];

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

      {/* DEPARTMENT MANAGERS CARD IN DEPARTMENT SECTION */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="nf-avatar sm" style={{ background: "#E8A33D26", color: "#E8A33D" }}>
              <Users size={16} />
            </div>
            <div>
              <h3 className="nf-h3" style={{ margin: 0 }}>Department Managers (5)</h3>
              <div style={{ fontSize: 11.5, color: "var(--ink-dim)", marginTop: 2 }}>
                Heads of Engineering, Product, HR, Finance, and Marketing
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {departmentManagers.map((m) => (
            <div
              key={m.empId || m.name}
              style={{
                background: "var(--surface-alt)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#E8A33D", textTransform: "uppercase" }}>{m.department}</div>
              <div style={{ fontWeight: 700, fontSize: 13.5, marginTop: 4 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: "var(--ink-dim)", marginTop: 2 }}>{m.designation || "Manager"}</div>
              <div style={{ fontSize: 11, color: "#2F8F82", marginTop: 6, fontWeight: 600 }}>{m.email}</div>
            </div>
          ))}
        </div>
      </Card>

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
              <label>Employee Count
                <input type="number" className="nf-select" value={deptForm.count} onChange={(e) => setDeptForm({ ...deptForm, count: e.target.value })} required />
              </label>
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
              <label>Employee Count
                <input type="number" className="nf-select" value={deptForm.count} onChange={(e) => setDeptForm({ ...deptForm, count: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setEditingDept(null)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEPARTMENT CARDS GRID - ONLY EMPLOYEES COUNT SHOWN */}
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

              <div style={{ background: "var(--surface-alt)", padding: "12px 16px", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                <div style={{ fontSize: 12.5, color: "var(--ink-dim)", fontWeight: 600 }}>Employees</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#E8A33D" }}>{displayCount}</div>
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
