import React, { useState, useEffect } from "react";
import { Plus, CheckCircle2, ShieldAlert, Edit3, Trash2, Calendar, Clock, User } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";
import { Pill } from "../common/Pill";
import { createTaskAPI } from "../../services/api";

const TASKS_INITIAL = {
  "To Do": [
    { id: "t1", title: "Set up CI pipeline", priority: "Medium", assignedDate: "20 Jul", deadline: "29 Jul", assignee: "Devansh Patil" },
    { id: "t2", title: "Draft Q3 hiring plan", priority: "Low", assignedDate: "22 Jul", deadline: "02 Aug", assignee: "Priya Nair" },
  ],
  "In Progress": [
    { id: "t3", title: "Backend API for leave module", priority: "High", assignedDate: "18 Jul", deadline: "27 Jul", assignee: "Ishita Rao" },
    { id: "t4", title: "Redesign employee card", priority: "Medium", assignedDate: "21 Jul", deadline: "28 Jul", assignee: "Vanshika Tripathi" },
  ],
  Review: [
    { id: "t5", title: "Build Login Module", priority: "High", assignedDate: "15 Jul", deadline: "25 Jul", assignee: "Vanshika Tripathi" },
  ],
  Completed: [
    { id: "t6", title: "Payroll approval workflow", priority: "High", assignedDate: "10 Jul", deadline: "18 Jul", assignee: "Meera Iyer" },
    { id: "t7", title: "Org chart v1", priority: "Low", assignedDate: "05 Jul", deadline: "12 Jul", assignee: "Rahul Sharma" },
  ],
};

export function TasksModule({ role, employees }) {
  const [board, setBoard] = useState(() => {
    const saved = localStorage.getItem("peoplepulse_tasks");
    return saved ? JSON.parse(saved) : TASKS_INITIAL;
  });

  useEffect(() => {
    localStorage.setItem("peoplepulse_tasks", JSON.stringify(board));
  }, [board]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingCol, setEditingCol] = useState("");
  const [notification, setNotification] = useState(null);

  const isManagerOrAdmin = role === "Manager" || role === "Admin";

  const [addForm, setAddForm] = useState({
    title: "",
    priority: "High",
    assignedDate: "25 Jul",
    deadline: "30 Jul",
    assignee: employees && employees.length > 0 ? employees[0].name : "Vanshika Tripathi",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    priority: "High",
    assignedDate: "",
    deadline: "",
    assignee: "",
    column: "To Do",
  });

  const cols = Object.keys(board);

  // Move task column handler
  const moveTask = (fromCol, toCol, taskId) => {
    if (fromCol === toCol) return;
    setBoard((prev) => {
      const taskObj = prev[fromCol].find((t) => t.id === taskId);
      return {
        ...prev,
        [fromCol]: prev[fromCol].filter((t) => t.id !== taskId),
        [toCol]: [...prev[toCol], taskObj],
      };
    });
  };

  // Create Task Handler
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!isManagerOrAdmin || !addForm.title.trim()) return;

    const newTask = {
      id: `t${Date.now()}`,
      title: addForm.title,
      priority: addForm.priority,
      assignedDate: addForm.assignedDate,
      deadline: addForm.deadline,
      assignee: addForm.assignee,
    };

    try {
      await createTaskAPI(newTask);
    } catch (err) {
      // Fallback
    }

    setBoard((prev) => ({
      ...prev,
      "To Do": [newTask, ...prev["To Do"]],
    }));

    setNotification(`Task "${addForm.title}" assigned to ${addForm.assignee}!`);
    setShowAddModal(false);
    setAddForm({
      title: "",
      priority: "High",
      assignedDate: "25 Jul",
      deadline: "30 Jul",
      assignee: employees && employees.length > 0 ? employees[0].name : "Vanshika Tripathi",
    });

    setTimeout(() => setNotification(null), 3500);
  };

  // Open Edit Task Modal
  const handleOpenEdit = (colName, taskObj) => {
    if (!isManagerOrAdmin) return;
    setEditingTask(taskObj);
    setEditingCol(colName);
    setEditForm({
      title: taskObj.title,
      priority: taskObj.priority,
      assignedDate: taskObj.assignedDate || "20 Jul",
      deadline: taskObj.deadline,
      assignee: taskObj.assignee,
      column: colName,
    });
  };

  // Save Edit Task Handler
  const handleSaveEditTask = (e) => {
    e.preventDefault();
    if (!editingTask || !isManagerOrAdmin) return;

    const updatedTask = {
      ...editingTask,
      title: editForm.title,
      priority: editForm.priority,
      assignedDate: editForm.assignedDate,
      deadline: editForm.deadline,
      assignee: editForm.assignee,
    };

    setBoard((prev) => {
      const oldList = prev[editingCol].filter((t) => t.id !== editingTask.id);
      if (editForm.column === editingCol) {
        return { ...prev, [editingCol]: [updatedTask, ...oldList] };
      } else {
        return {
          ...prev,
          [editingCol]: oldList,
          [editForm.column]: [updatedTask, ...prev[editForm.column]],
        };
      }
    });

    setEditingTask(null);
    setNotification(`Updated task "${editForm.title}"!`);
    setTimeout(() => setNotification(null), 3500);
  };

  // Delete Task Handler (Admin & Manager)
  const handleDeleteTask = (colName, taskId, taskTitle) => {
    if (!isManagerOrAdmin) return;
    setBoard((prev) => ({
      ...prev,
      [colName]: prev[colName].filter((t) => t.id !== taskId),
    }));
    setNotification(`Deleted task "${taskTitle}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <>
      <SectionTitle
        title="Task board"
        action={
          isManagerOrAdmin ? (
            <button className="nf-btn primary" onClick={() => setShowAddModal(true)}>
              <Plus size={14} /> New task
            </button>
          ) : (
            <div className="nf-pill nf-pill-default" style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <ShieldAlert size={12} /> Employee View (Mark Completed Only)
            </div>
          )
        }
      />

      {notification && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {/* New Task Modal */}
      {showAddModal && isManagerOrAdmin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 460, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Assign New Task</h3>
            <form onSubmit={handleCreateTask} className="nf-form">
              <label>Task Title
                <input className="nf-select" placeholder="e.g. Build Payment Gateway" value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Priority
                  <select className="nf-select" value={addForm.priority} onChange={(e) => setAddForm({ ...addForm, priority: e.target.value })}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </label>
                <label style={{ flex: 1 }}>Assigned Date
                  <input className="nf-select" placeholder="e.g. 20 Jul" value={addForm.assignedDate} onChange={(e) => setAddForm({ ...addForm, assignedDate: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Due Date
                  <input className="nf-select" placeholder="e.g. 30 Jul" value={addForm.deadline} onChange={(e) => setAddForm({ ...addForm, deadline: e.target.value })} required />
                </label>
              </div>
              <label>Assign To Employee
                <select className="nf-select" value={addForm.assignee} onChange={(e) => setAddForm({ ...addForm, assignee: e.target.value })}>
                  {employees && employees.map((emp) => (
                    <option key={emp.id || emp.empId} value={emp.name}>
                      {emp.name} ({emp.designation})
                    </option>
                  ))}
                </select>
              </label>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Create &amp; Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && isManagerOrAdmin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 460, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Edit Task Details</h3>
            <form onSubmit={handleSaveEditTask} className="nf-form">
              <label>Task Title
                <input className="nf-select" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Status Column
                  <select className="nf-select" value={editForm.column} onChange={(e) => setEditForm({ ...editForm, column: e.target.value })}>
                    {cols.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label style={{ flex: 1 }}>Priority
                  <select className="nf-select" value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </label>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Assigned Date
                  <input className="nf-select" value={editForm.assignedDate} onChange={(e) => setEditForm({ ...editForm, assignedDate: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Due Date
                  <input className="nf-select" value={editForm.deadline} onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })} required />
                </label>
              </div>
              <label>Assignee Name
                <input className="nf-select" value={editForm.assignee} onChange={(e) => setEditForm({ ...editForm, assignee: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setEditingTask(null)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Row-Wise Stacked Horizontal Task Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {cols.map((col) => (
          <div key={col} style={{ background: "var(--surface-alt)", padding: "20px 22px", borderRadius: 16, border: "1px solid var(--border)" }}>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                letterSpacing: "0.05em",
                color: "var(--accent-2)",
                paddingBottom: "16px",
                borderBottom: "1px solid var(--border)",
                marginBottom: "18px",
              }}
            >
              {col.toUpperCase()}
            </div>

            {/* Spacious 3-Column Horizontal Grid */}
            <div className="nf-grid-3">
              {board[col].map((t) => (
                <Card key={t.id} style={{ padding: "18px 20px", margin: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.4 }}>{t.title}</div>
                    <Pill tone={t.priority === "High" ? "bad" : t.priority === "Medium" ? "warn" : "default"}>{t.priority}</Pill>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "var(--ink-dim)", marginTop: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Calendar size={13} /> Assigned: {t.assignedDate || "20 Jul"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Clock size={13} /> Due: {t.deadline}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "var(--ink)" }}>
                      <User size={13} /> {t.assignee}
                    </div>
                  </div>

                  {/* Controls */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 16,
                      paddingTop: 12,
                      borderTop: "1px solid var(--border)",
                      flexWrap: "nowrap",
                    }}
                  >
                    {/* Request 4: Employee role can only shift task to Completed */}
                    <select
                      className="nf-select"
                      style={{ fontSize: 11, padding: "4px 6px", flex: 1, minWidth: 0 }}
                      value={col}
                      onChange={(e) => moveTask(col, e.target.value, t.id)}
                    >
                      {isManagerOrAdmin ? (
                        cols.map((c) => <option key={c} value={c}>Move to {c}</option>)
                      ) : (
                        <>
                          <option value={col}>Status: {col}</option>
                          {col !== "Completed" && <option value="Completed">Mark as Completed</option>}
                        </>
                      )}
                    </select>

                    {/* Edit & Delete buttons strictly hidden for Employee role */}
                    {isManagerOrAdmin && (
                      <>
                        <button
                          className="nf-btn ghost sm"
                          style={{ padding: "4px 8px", fontSize: 11.5, flexShrink: 0 }}
                          title="Edit task"
                          onClick={() => handleOpenEdit(col, t)}
                        >
                          <Edit3 size={12} /> Edit
                        </button>

                        {col === "Completed" && (
                          <button
                            className="nf-btn ghost sm danger"
                            style={{ padding: "4px 8px", fontSize: 11.5, flexShrink: 0 }}
                            title="Delete completed task"
                            onClick={() => handleDeleteTask(col, t.id, t.title)}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {board[col].length === 0 && (
              <div className="nf-empty" style={{ padding: 20, fontSize: 13 }}>No tasks in {col}</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
