import React from "react";
import { Pill } from "./Pill";
import { Card } from "./Card";
import { ChevronRight } from "lucide-react";

export const DEPT_COLORS = {
  Engineering: "#2F8F82",
  HR: "#6C6FB0",
  "Human Resources": "#6C6FB0",
  Finance: "#E8A33D",
  Marketing: "#E2604F",
  Sales: "#3B82F6",
  Operations: "#8B5CF6",
  Design: "#EC4899",
  Product: "#10B981",
  Analytics: "#8B5CF6",
  "Customer Success": "#F59E0B",
};

export function EmployeeBadge({ emp, onClick }) {
  const color = DEPT_COLORS[emp.department] || "#2F8F82";

  return (
    <Card className="nf-badge" style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="nf-badge-stripe" style={{ background: color }} />
      <div className="nf-badge-body" style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div className="nf-avatar" style={{ background: `${color}26`, color, width: 44, height: 44, fontSize: 16 }}>
            {emp.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="nf-badge-name" style={{ fontSize: 15, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {emp.name}
            </div>
            <div className="nf-badge-role" style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 2 }}>
              {emp.designation}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 700, fontFamily: "'Inter', sans-serif", color: "var(--ink-dim)" }}>{emp.empId}</div>

        <div className="nf-badge-row" style={{ fontSize: 12.5, marginTop: 4 }}>
          <span>🏢 {emp.department}</span>
        </div>
        <div className="nf-badge-row" style={{ fontSize: 12.5, marginTop: 2 }}>
          <span>💼 {emp.experience}</span>
        </div>
        <div className="nf-badge-row" style={{ fontSize: 12.5, marginTop: 2 }}>
          <span>👤 Reports to {emp.manager}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
          <Pill tone={emp.status === "Active" ? "good" : "warn"}>{emp.status}</Pill>
          {onClick && (
            <button className="nf-btn ghost sm" onClick={onClick} style={{ padding: "4px 10px", fontSize: 12, gap: 3 }}>
              View profile <ChevronRight size={13} />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
