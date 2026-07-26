import React, { useState } from "react";
import { Search, Bell, Sun, Moon, User, Building2, ListChecks, ChevronRight, X, Calendar } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { DEPT_COLORS } from "../common/EmployeeBadge";

export function Topbar({ role, setPage, employees = [], goProfile }) {
  const { dark, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  const matchedEmployees = searchTerm.trim()
    ? employees.filter(
        (e) =>
          e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSelectEmp = (emp) => {
    setShowResults(false);
    setSearchTerm("");
    if (goProfile) {
      goProfile(emp);
    } else {
      setPage("directory");
    }
  };

  return (
    <div className="nf-topbar">
      <div className="nf-search" style={{ position: "relative" }}>
        <Search size={14} />
        <input
          placeholder="Search employee, ID, department…"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
        />
        {searchTerm && (
          <X
            size={13}
            style={{ cursor: "pointer", color: "var(--ink-dim)" }}
            onClick={() => {
              setSearchTerm("");
              setShowResults(false);
            }}
          />
        )}

        {showResults && searchTerm.trim().length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "115%",
              left: 0,
              width: 340,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
              zIndex: 200,
              padding: "10px 0",
              maxHeight: 320,
              overflowY: "auto",
            }}
          >
            <div className="nf-eyebrow" style={{ padding: "4px 14px 8px" }}>
              Search Results ({matchedEmployees.length})
            </div>

            {matchedEmployees.map((emp) => {
              const color = DEPT_COLORS[emp.department] || "#2F8F82";
              return (
                <div
                  key={emp.id || emp.empId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 14px",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  className="nf-search-item"
                  onClick={() => handleSelectEmp(emp)}
                >
                  <div className="nf-avatar sm" style={{ background: `${color}26`, color }}>
                    {emp.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>
                      {emp.designation} · {emp.department}
                    </div>
                  </div>
                  <span className="nf-mono" style={{ fontSize: 10.5, color: "var(--ink-dim)" }}>
                    {emp.empId}
                  </span>
                  <ChevronRight size={13} style={{ color: "var(--ink-dim)" }} />
                </div>
              );
            })}

            {matchedEmployees.length === 0 && (
              <div style={{ padding: "14px", textAlign: "center", fontSize: 12.5, color: "var(--ink-dim)" }}>
                No employees or records match "{searchTerm}".
              </div>
            )}
          </div>
        )}
      </div>

      <span className="nf-role-tag">{role ? role.toUpperCase() : "GUEST"} MODE</span>
      <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-dim)", display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "var(--surface-alt)", borderRadius: 20, border: "1px solid var(--border)" }}>
          <Calendar size={13} style={{ color: "var(--accent-2)" }} />
          {new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
        </div>
        <button className="nf-iconbtn" onClick={() => setPage("notifications")}>
          <Bell size={16} />
        </button>
        <button className="nf-iconbtn" onClick={toggleTheme}>
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  );
}
