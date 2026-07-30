import React from "react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";
import { DEPT_COLORS } from "../common/EmployeeBadge";

export function OrgChartModule({ role, employees = [] }) {
  // Exclude Admin (Aman Verma) from employee reporting tree as requested
  const validEmployees = (employees && employees.length > 0)
    ? employees.filter((e) => e.role !== "Admin" && e.name !== "Aman Verma")
    : [];

  const managersList = validEmployees.filter((e) => e.role === "Manager");

  return (
    <>
      <SectionTitle title="Organizational Hierarchy & Reporting Structure" />

      <Card style={{ padding: 24, overflowX: "auto" }}>
        <div style={{ fontSize: 12, color: "var(--ink-dim)", marginBottom: 20, textAlign: "center" }}>
          Showing 5 Department Managers and 10 Team Members reporting to each Manager
        </div>

        {/* GRID OF 5 DEPARTMENTS (1 MANAGER + 10 EMPLOYEES EACH) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(240px, 1fr))", gap: 16 }}>
          {managersList.map((mgr) => {
            const deptEmployees = validEmployees.filter(
              (e) => e.role === "Employee" && e.department === mgr.department
            );
            const color = DEPT_COLORS[mgr.department] || "#38BDF8";

            return (
              <div
                key={mgr.empId || mgr.name}
                style={{
                  background: "var(--surface-alt)",
                  border: `1.5px solid ${color}44`,
                  borderRadius: 14,
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {/* MANAGER CARD HEADER */}
                <div
                  style={{
                    background: `${color}18`,
                    border: `1px solid ${color}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div className="nf-avatar" style={{ background: color, color: "#fff", fontWeight: 700 }}>
                    {mgr.initials || mgr.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: color, textTransform: "uppercase" }}>
                      {mgr.department} MANAGER
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{mgr.name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>{mgr.designation}</div>
                  </div>
                </div>

                <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--ink-dim)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>
                  Reporting Employees ({deptEmployees.length})
                </div>

                {/* EMPLOYEES REPORTING TO THIS MANAGER */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {deptEmployees.map((emp) => (
                    <div
                      key={emp.empId || emp.name}
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        padding: "8px 10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="nf-avatar sm" style={{ background: `${color}22`, color: color, fontWeight: 700, fontSize: 10.5 }}>
                          {emp.initials || emp.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>{emp.name}</div>
                          <div style={{ fontSize: 10.5, color: "var(--ink-dim)" }}>{emp.designation}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
