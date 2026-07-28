import React, { useState, useEffect } from "react";
import { User, Edit3, CheckCircle2 } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";
import { DEPT_COLORS } from "../common/EmployeeBadge";

const INITIAL_NODES = [
  { id: "1", name: "Aman Verma", role: "Engineering Head", department: "Engineering", reportsTo: null },
  { id: "2", name: "Rahul Sharma", role: "Senior Engineering Manager", department: "Engineering", reportsTo: "Aman Verma" },
  { id: "3", name: "Priya Nair", role: "Product Manager", department: "Product", reportsTo: "Aman Verma" },
  { id: "4", name: "Pooja Joshi", role: "HR Manager", department: "Human Resources", reportsTo: "Aman Verma" },
  { id: "5", name: "Meera Iyer", role: "Finance Manager", department: "Finance", reportsTo: "Aman Verma" },
  { id: "6", name: "Anjali Deshmukh", role: "Marketing Manager", department: "Marketing", reportsTo: "Aman Verma" },
  { id: "7", name: "Ritika Bansal", role: "Customer Success Manager", department: "Customer Success", reportsTo: "Aman Verma" },
  { id: "8", name: "Vanshika Tripathi", role: "Frontend Developer", department: "Engineering", reportsTo: "Rahul Sharma" },
  { id: "9", name: "Aditi Tripathi", role: "Backend Developer", department: "Engineering", reportsTo: "Rahul Sharma" },
  { id: "10", name: "Rohan Gupta", role: "Full Stack Developer", department: "Engineering", reportsTo: "Rahul Sharma" },
  { id: "11", name: "Karan Malhotra", role: "QA Lead", department: "Engineering", reportsTo: "Rahul Sharma" },
  { id: "12", name: "Sneha Patel", role: "DevOps Engineer", department: "Engineering", reportsTo: "Rahul Sharma" },
  { id: "13", name: "Harsh Agrawal", role: "Mobile App Developer", department: "Engineering", reportsTo: "Rahul Sharma" },
  { id: "14", name: "Kavya Reddy", role: "React Developer", department: "Engineering", reportsTo: "Rahul Sharma" },
  { id: "15", name: "Deepak Yadav", role: "Node.js Developer", department: "Engineering", reportsTo: "Rahul Sharma" },
  { id: "16", name: "Mohit Saxena", role: "Cybersecurity Engineer", department: "Engineering", reportsTo: "Rahul Sharma" },
  { id: "17", name: "Shreya Ghosh", role: "Software Engineer", department: "Engineering", reportsTo: "Rahul Sharma" },
  { id: "18", name: "Neha Singh", role: "UI/UX Designer", department: "Design", reportsTo: "Priya Nair" },
  { id: "19", name: "Ishita Roy", role: "Business Analyst", department: "Product", reportsTo: "Priya Nair" },
  { id: "20", name: "Arjun Mehta", role: "Data Analyst", department: "Analytics", reportsTo: "Priya Nair" },
  { id: "21", name: "Tanvi Kulkarni", role: "Data Scientist", department: "Analytics", reportsTo: "Priya Nair" },
  { id: "22", name: "Nikhil Jain", role: "Talent Acquisition Specialist", department: "Human Resources", reportsTo: "Pooja Joshi" },
  { id: "23", name: "Siddharth Kapoor", role: "Accountant", department: "Finance", reportsTo: "Meera Iyer" },
  { id: "24", name: "Vivek Mishra", role: "Digital Marketing Executive", department: "Marketing", reportsTo: "Anjali Deshmukh" },
  { id: "25", name: "Abhishek Tiwari", role: "Support Engineer", department: "Customer Success", reportsTo: "Ritika Bansal" },
];

export function OrgChartModule({ role, employees = [] }) {
  // Dynamically map nodes from live populated MongoDB Atlas database
  const activeNodes = (employees && employees.length > 0)
    ? employees.map((emp) => {
        const roleStr = emp.designation || emp.role || "Team Member";
        let defaultReports = null;
        if (roleStr.includes("Head") || roleStr.includes("CEO") || emp.name === "Aman Verma") {
          defaultReports = null;
        } else if (roleStr.includes("Manager") || roleStr.includes("Lead") || emp.name === "Rahul Sharma" || emp.name === "Priya Nair") {
          defaultReports = "Aman Verma";
        } else {
          defaultReports = emp.department === "Product" ? "Priya Nair" : "Rahul Sharma";
        }
        return {
          id: emp._id || emp.id || emp.empId,
          name: emp.name,
          role: roleStr,
          department: emp.department || "Engineering",
          reportsTo: emp.reportsTo || defaultReports,
          avatar: emp.initials || emp.name.split(" ").map(w => w[0]).slice(0, 2).join(""),
        };
      })
    : INITIAL_NODES;

  const [editingNode, setEditingNode] = useState(null);
  const [notification, setNotification] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    role: "",
    department: "Engineering",
    reportsTo: "Aman Verma",
  });

  const isManagerOrAdmin = role === "Admin" || role === "Manager";

  const handleOpenEdit = (node) => {
    if (!isManagerOrAdmin) return;
    setEditingNode(node);
    setEditForm({
      name: node.name,
      role: node.role,
      department: node.department,
      reportsTo: node.reportsTo || "—",
    });
  };

  const handleSavePosition = (e) => {
    e.preventDefault();
    if (!editingNode) return;
    setEditingNode(null);
    setNotification(`Updated position details for ${editingNode.name}!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const heads = activeNodes.filter((n) => !n.reportsTo || n.role.includes("Head") || n.role.includes("CEO") || n.name === "Aman Verma");
  const headNames = new Set(heads.map((h) => h.name));

  const managers = activeNodes.filter((n) => !headNames.has(n.name) && (n.reportsTo === "Aman Verma" || n.role.includes("Manager") || n.role.includes("Lead")));
  const managerNames = new Set([...headNames, ...managers.map((m) => m.name)]);

  const teamMembers = activeNodes.filter((n) => !managerNames.has(n.name));

  return (
    <>
      <SectionTitle title="Organizational Hierarchy" />

      {notification && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {editingNode && isManagerOrAdmin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 440, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Edit Employee Position — {editingNode.name}</h3>
            <form onSubmit={handleSavePosition} className="nf-form">
              <label>Designation / Role Title
                <input className="nf-select" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Department
                  <select className="nf-select" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}>
                    <option>Engineering</option>
                    <option>Product</option>
                    <option>Design</option>
                    <option>Human Resources</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                    <option>Customer Success</option>
                    <option>Analytics</option>
                  </select>
                </label>
                <label style={{ flex: 1 }}>Reports To
                  <input className="nf-select" value={editForm.reportsTo} onChange={(e) => setEditForm({ ...editForm, reportsTo: e.target.value })} required />
                </label>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setEditingNode(null)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card style={{ padding: 28, overflowX: "auto" }}>
        {/* LEVEL 1: EXECUTIVE LEADERSHIP */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--ink-dim)", textTransform: "uppercase", marginBottom: 12 }}>
            Executive Leadership
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            {heads.map((n) => {
              const color = DEPT_COLORS[n.department] || "#E8A33D";
              return (
                <div
                  key={n.id}
                  style={{
                    background: "var(--surface-alt)",
                    border: `2px solid ${color}`,
                    borderRadius: 14,
                    padding: "16px 24px",
                    minWidth: 240,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="nf-avatar" style={{ background: `${color}26`, color: color, fontWeight: 700 }}>
                      {n.avatar}
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{n.name}</div>
                      <div style={{ fontSize: 12, color: color, fontWeight: 600 }}>{n.role}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-dim)", marginTop: 2 }}>{n.department}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONNECTOR LINE */}
        <div style={{ width: 2, height: 28, background: "var(--border)", margin: "-16px auto 20px" }} />

        {/* LEVEL 2: DEPARTMENT MANAGERS & LEADS */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--ink-dim)", textTransform: "uppercase", marginBottom: 12 }}>
            Department Management &amp; Leads ({managers.length})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16 }}>
            {managers.map((n) => {
              const color = DEPT_COLORS[n.department] || "#38BDF8";
              return (
                <div
                  key={n.id}
                  style={{
                    background: "var(--surface-alt)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: "12px 14px",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="nf-avatar sm" style={{ background: `${color}26`, color: color, fontWeight: 700 }}>
                      {n.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{n.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--ink-dim)" }}>{n.role}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONNECTOR LINE */}
        <div style={{ width: 2, height: 28, background: "var(--border)", margin: "-16px auto 20px" }} />

        {/* LEVEL 3: TEAM MEMBERS */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--ink-dim)", textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>
            Engineers &amp; Team Members ({teamMembers.length})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {teamMembers.map((n) => {
              const color = DEPT_COLORS[n.department] || "#2F8F82";
              return (
                <div
                  key={n.id}
                  style={{
                    background: "var(--surface-alt)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div className="nf-avatar sm" style={{ background: `${color}26`, color: color, fontWeight: 700 }}>
                    {n.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 12.5 }}>{n.name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>{n.role}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </>
  );
}
