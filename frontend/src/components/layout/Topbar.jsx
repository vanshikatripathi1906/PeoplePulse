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
      <div style={{ flex: 1 }} />

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
