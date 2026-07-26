import React, { useState } from "react";
import { Search, Filter, Plus, Edit3, Trash2, CheckCircle2 } from "lucide-react";
import { EmployeeBadge } from "../common/EmployeeBadge";
import { SectionTitle } from "../common/SectionTitle";

export function DirectoryModule({ role, employees, departments, goProfile, onAddEmployee, onDeleteEmployee }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const isManagerOrAdmin = role === "Admin" || role === "Manager";

  const [addForm, setAddForm] = useState({
    name: "",
    designation: "",
    department: "Engineering",
    experience: "1 Year",
    email: "",
    phone: "+91 98000 12345",
  });

  const filteredEmployees = (employees || []).filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "all" || emp.department.toLowerCase() === selectedDept.toLowerCase();
    return matchesSearch && matchesDept;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!isManagerOrAdmin || !addForm.name.trim()) return;

    const newEmp = {
      id: Date.now(),
      empId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: addForm.name,
      designation: addForm.designation || "Software Associate",
      department: addForm.department,
      experience: addForm.experience,
      manager: "Aman Verma",
      email: addForm.email || `${addForm.name.toLowerCase().replace(/\s+/g, ".")}@peoplepulse.co`,
      phone: addForm.phone,
      location: "Indore HQ",
      type: "Full-time",
      status: "Active",
      joined: "Jul 2026",
      initials: addForm.name.split(" ").map((w) => w[0]).slice(0, 2).join(""),
      attendance: Array(28).fill("P"),
      skills: [{ name: "React", level: 3 }, { name: "Communication", level: 4 }],
      documents: ["Resume", "Offer Letter"],
      perf: { Technical: 8, Communication: 8, Leadership: 7, "Problem Solving": 8, Teamwork: 8 },
      salary: { gross: 60000, tax: 6000, pf: 2400, bonus: 2000, net: 53600 },
    };

    if (onAddEmployee) onAddEmployee(newEmp);
    setShowAddModal(false);
    setNotification(`Successfully added new employee "${addForm.name}"!`);
    setAddForm({ name: "", designation: "", department: "Engineering", experience: "1 Year", email: "", phone: "+91 98000 12345" });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDelete = (emp) => {
    if (!isManagerOrAdmin) return;
    if (onDeleteEmployee) onDeleteEmployee(emp.empId || emp.id);
    setNotification(`Deleted employee record for ${emp.name}`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <>
      <SectionTitle
        title="List of Employees"
        action={
          isManagerOrAdmin && (
            <button className="nf-btn primary" onClick={() => setShowAddModal(true)}>
              <Plus size={14} /> Add Employee
            </button>
          )
        }
      />

      {notification && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && isManagerOrAdmin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 460, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Add New Employee</h3>
            <form onSubmit={handleAddSubmit} className="nf-form">
              <label>Full Name
                <input className="nf-select" placeholder="e.g. Rahul Verma" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Designation
                  <input className="nf-select" placeholder="e.g. Senior Frontend Dev" value={addForm.designation} onChange={(e) => setAddForm({ ...addForm, designation: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Department
                  <select className="nf-select" value={addForm.department} onChange={(e) => setAddForm({ ...addForm, department: e.target.value })}>
                    <option>Engineering</option>
                    <option>HR</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                  </select>
                </label>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Experience
                  <input className="nf-select" placeholder="e.g. 3 Years" value={addForm.experience} onChange={(e) => setAddForm({ ...addForm, experience: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Work Email
                  <input className="nf-select" placeholder="rahul@peoplepulse.co" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} />
                </label>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Add Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div className="nf-search" style={{ flex: 1, minWidth: 260 }}>
          <Search size={16} />
          <input
            placeholder="Search by name, ID, or designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="nf-select"
          style={{ width: 180 }}
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments && departments.map((d) => (
            <option key={d.name} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Employee Cards Grid */}
      <div className="nf-grid-3" style={{ gap: 24, marginTop: 24 }}>
        {filteredEmployees.map((emp) => (
          <div key={emp.id || emp.empId} style={{ position: "relative" }}>
            <EmployeeBadge emp={emp} onClick={() => goProfile && goProfile(emp)} boldId={true} />
            {isManagerOrAdmin && (
              <button
                className="nf-btn ghost sm danger"
                title="Delete Employee"
                style={{ position: "absolute", top: 12, right: 12, zIndex: 2, padding: "4px 8px" }}
                onClick={(e) => { e.stopPropagation(); handleDelete(emp); }}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="nf-empty" style={{ marginTop: 30 }}>
          No employees found matching "{searchQuery}".
        </div>
      )}
    </>
  );
}
