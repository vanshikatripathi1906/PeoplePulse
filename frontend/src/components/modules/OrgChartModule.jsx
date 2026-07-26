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
  { id: "11", name: "Karan Malhotra", role: "QA Engineer", department: "Engineering", reportsTo: "Rahul Sharma" },
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

export function OrgChartModule({ role }) {
  const [nodes, setNodes] = useState(() => {
    try {
      const saved = localStorage.getItem("peoplepulse_org_nodes");
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && Array.isArray(parsed) && parsed.length >= 25) {
        return parsed;
      }
    } catch (e) {}
    return INITIAL_NODES;
  });

  useEffect(() => {
    localStorage.setItem("peoplepulse_org_nodes", JSON.stringify(nodes));
  }, [nodes]);

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

    const updated = nodes.map((n) => {
      if (n.id === editingNode.id) {
        return {
          ...n,
          role: editForm.role,
          department: editForm.department,
          reportsTo: editForm.reportsTo === "—" ? null : editForm.reportsTo,
        };
      }
      return n;
    });

    setNodes(updated);
    setEditingNode(null);
    setNotification(`Updated position details for ${editingNode.name}!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const heads = nodes.filter((n) => !n.reportsTo);
  const managers = nodes.filter((n) => n.reportsTo === "Aman Verma" || n.reportsTo === "Priya Nair");
  const teamMembers = nodes.filter((n) => n.reportsTo === "Rahul Sharma");

  return (
    <>
      <SectionTitle eyebrow="Structure" title="Organizational Hierarchy" />

      {notification && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {/* Edit Position Modal */}
      {editingNode && (
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
                    <option>HR</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                  </select>
                </label>
                <label style={{ flex: 1 }}>Reports To Manager
                  <select className="nf-select" value={editForm.reportsTo} onChange={(e) => setEditForm({ ...editForm, reportsTo: e.target.value })}>
                    <option value="—">— (Executive Head)</option>
                    <option value="Aman Verma">Aman Verma</option>
                    <option value="Priya Nair">Priya Nair</option>
                    <option value="Rahul Sharma">Rahul Sharma</option>
                  </select>
                </label>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setEditingNode(null)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Update Position</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card style={{ padding: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "center" }}>
          {/* Level 1 */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
              Level 1 — Executive Department Heads
            </div>
            <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
              {heads.map((n) => (
                <NodeCard key={n.id} node={n} onEdit={() => handleOpenEdit(n)} canEdit={isManagerOrAdmin} />
              ))}
            </div>
          </div>

          <div style={{ width: 2, height: 24, background: "var(--border)" }} />

          {/* Level 2 */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
              Level 2 — Engineering &amp; Operations Managers
            </div>
            <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
              {managers.map((n) => (
                <NodeCard key={n.id} node={n} onEdit={() => handleOpenEdit(n)} canEdit={isManagerOrAdmin} />
              ))}
            </div>
          </div>

          <div style={{ width: 2, height: 24, background: "var(--border)" }} />

          {/* Level 3 */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
              Level 3 — Engineering Leads &amp; Developers
            </div>
            <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
              {teamMembers.map((n) => (
                <NodeCard key={n.id} node={n} onEdit={() => handleOpenEdit(n)} canEdit={isManagerOrAdmin} />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

function NodeCard({ node, onEdit, canEdit }) {
  const color = DEPT_COLORS[node.department] || "#2F8F82";
  const initials = node.name.split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <div
      style={{
        background: "var(--surface-alt)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "12px 18px",
        minWidth: 240,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="nf-avatar sm" style={{ background: `${color}26`, color, fontWeight: 700 }}>
          {initials}
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{node.name}</div>
          <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>{node.role}</div>
          <div style={{ fontSize: 10.5, color: color, fontWeight: 600, marginTop: 2 }}>{node.department}</div>
        </div>
      </div>
      {canEdit && (
        <button className="nf-btn ghost sm" title="Edit position" style={{ padding: "4px 8px" }} onClick={onEdit}>
          <Edit3 size={13} />
        </button>
      )}
    </div>
  );
}
