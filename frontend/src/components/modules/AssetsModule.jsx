import React, { useState, useEffect } from "react";
import { Laptop, Monitor, Mouse, CreditCard, Plus, CheckCircle2, Edit3, Trash2 } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";
import { Pill } from "../common/Pill";

const INITIAL_ASSETS = [
  { id: 1, name: "MacBook Pro 16\"", category: "Laptop", serial: "MBP-2024-8819", assignedTo: "Vanshika Tripathi", issueDate: "15 Mar 2024", returnDate: "—", status: "Assigned" },
  { id: 2, name: "Dell UltraSharp 27\" 4K", category: "Monitor", serial: "DEL-274K-9901", assignedTo: "Vanshika Tripathi", issueDate: "16 Mar 2024", returnDate: "—", status: "Assigned" },
  { id: 3, name: "Logitech MX Master 3S", category: "Mouse", serial: "LOG-MX3S-1102", assignedTo: "Ishita Rao", issueDate: "01 Dec 2022", returnDate: "—", status: "Assigned" },
  { id: 4, name: "HQ Smart Access Card", category: "Access Card", serial: "CARD-HQ-0041", assignedTo: "Aman Verma", issueDate: "10 Jan 2018", returnDate: "—", status: "Assigned" },
  { id: 5, name: "ThinkPad T14 Gen 4", category: "Laptop", serial: "THK-T14-5512", assignedTo: "Devansh Patil", issueDate: "05 Feb 2025", returnDate: "—", status: "Assigned" },
  { id: 6, name: "LG Ergonomic Monitor 32\"", category: "Monitor", serial: "LG-32ER-3390", assignedTo: "Unassigned", issueDate: "—", returnDate: "—", status: "Available" },
];

export function AssetsModule({ role, employees }) {
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem("peoplepulse_assets");
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  useEffect(() => {
    localStorage.setItem("peoplepulse_assets", JSON.stringify(assets));
  }, [assets]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [notification, setNotification] = useState(null);

  const isManagerOrAdmin = role === "Admin" || role === "Manager";

  const [addForm, setAddForm] = useState({
    name: "",
    category: "Laptop",
    serial: "",
    assignedTo: employees && employees.length > 0 ? employees[0].name : "Vanshika Tripathi",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    category: "Laptop",
    serial: "",
    assignedTo: "",
    status: "Assigned",
  });

  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!isManagerOrAdmin || !addForm.name.trim()) return;

    const newAsset = {
      id: Date.now(),
      name: addForm.name,
      category: addForm.category,
      serial: addForm.serial || `SN-${Math.floor(1000 + Math.random() * 9000)}`,
      assignedTo: addForm.assignedTo,
      issueDate: "25 Jul 2026",
      returnDate: "—",
      status: "Assigned",
    };

    setAssets([newAsset, ...assets]);
    setShowAddModal(false);
    setNotification(`Successfully assigned ${addForm.name} to ${addForm.assignedTo}!`);
    setAddForm({
      name: "",
      category: "Laptop",
      serial: "",
      assignedTo: employees && employees.length > 0 ? employees[0].name : "Vanshika Tripathi",
    });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenEdit = (ast) => {
    if (!isManagerOrAdmin) return;
    setEditingAsset(ast);
    setEditForm({
      name: ast.name,
      category: ast.category,
      serial: ast.serial,
      assignedTo: ast.assignedTo,
      status: ast.status,
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!isManagerOrAdmin || !editingAsset) return;

    const updated = assets.map((ast) => {
      if (ast.id === editingAsset.id) {
        return { ...ast, ...editForm };
      }
      return ast;
    });

    setAssets(updated);
    setEditingAsset(null);
    setNotification(`Updated asset details for "${editForm.name}"!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDeleteAsset = (id, name) => {
    if (!isManagerOrAdmin) return;
    setAssets(assets.filter((ast) => ast.id !== id));
    setNotification(`Deleted asset "${name}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  const getCategoryIcon = (cat) => {
    if (cat === "Laptop") return Laptop;
    if (cat === "Monitor") return Monitor;
    if (cat === "Mouse") return Mouse;
    return CreditCard;
  };

  return (
    <>
      <SectionTitle
        eyebrow="Inventory"
        title="Asset Management"
        action={
          isManagerOrAdmin && (
            <button className="nf-btn primary" onClick={() => setShowAddModal(true)}>
              <Plus size={14} /> Assign New Asset
            </button>
          )
        }
      />

      {notification && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {showAddModal && isManagerOrAdmin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 440, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Assign Hardware / Asset</h3>
            <form onSubmit={handleAddAsset} className="nf-form">
              <label>Asset Device Name
                <input className="nf-select" placeholder="e.g. Dell XPS 15 Laptop" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Category
                  <select className="nf-select" value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}>
                    <option>Laptop</option>
                    <option>Monitor</option>
                    <option>Mouse</option>
                    <option>Access Card</option>
                  </select>
                </label>
                <label style={{ flex: 1 }}>Serial Number
                  <input className="nf-select" placeholder="e.g. SN-8829-X" value={addForm.serial} onChange={(e) => setAddForm({ ...addForm, serial: e.target.value })} />
                </label>
              </div>
              <label>Assign To Employee
                <select className="nf-select" value={addForm.assignedTo} onChange={(e) => setAddForm({ ...addForm, assignedTo: e.target.value })}>
                  {employees && employees.map((emp) => (
                    <option key={emp.id || emp.empId} value={emp.name}>
                      {emp.name} ({emp.designation})
                    </option>
                  ))}
                </select>
              </label>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Assign Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingAsset && isManagerOrAdmin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 440, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Edit Asset Details</h3>
            <form onSubmit={handleSaveEdit} className="nf-form">
              <label>Asset Device Name
                <input className="nf-select" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Category
                  <select className="nf-select" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                    <option>Laptop</option>
                    <option>Monitor</option>
                    <option>Mouse</option>
                    <option>Access Card</option>
                  </select>
                </label>
                <label style={{ flex: 1 }}>Serial Number
                  <input className="nf-select" value={editForm.serial} onChange={(e) => setEditForm({ ...editForm, serial: e.target.value })} required />
                </label>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Assigned Employee
                  <input className="nf-select" value={editForm.assignedTo} onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Status
                  <select className="nf-select" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                    <option>Assigned</option>
                    <option>Available</option>
                    <option>Under Repair</option>
                  </select>
                </label>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setEditingAsset(null)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card>
        <div className="nf-card-head" style={{ marginBottom: 14 }}>
          <h3 className="nf-h3">Company Hardware &amp; Inventory Track ({assets.length})</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {assets.map((ast) => {
            const Icon = getCategoryIcon(ast.category);
            return (
              <div
                key={ast.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "var(--surface-alt)",
                  borderRadius: 10,
                  fontSize: 13,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="nf-avatar sm" style={{ background: "#38BDF826", color: "#38BDF8" }}>
                    <Icon size={15} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{ast.name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-dim)", fontFamily: "'Inter', sans-serif", fontWeight: 400, marginTop: 2 }}>
                      S/N: {ast.serial} · {ast.category}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 600, fontSize: 12.5 }}>Assigned: {ast.assignedTo}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>Issued: {ast.issueDate}</div>
                  </div>
                  <Pill tone={ast.status === "Assigned" ? "good" : "default"}>{ast.status}</Pill>
                  {isManagerOrAdmin && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="nf-btn ghost sm" title="Edit Asset" onClick={() => handleOpenEdit(ast)}>
                        <Edit3 size={13} />
                      </button>
                      <button className="nf-btn ghost sm danger" title="Delete Asset" onClick={() => handleDeleteAsset(ast.id, ast.name)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
