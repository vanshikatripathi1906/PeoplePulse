import React from "react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";
import { DEPT_COLORS } from "../common/EmployeeBadge";
import { ShieldCheck, Users } from "lucide-react";

export function OrgChartModule({ role, employees = [], currentUser }) {
  const isAdmin = role === "Admin";
  const isManager = role === "Manager";

  // Active workforce (50 employees total: 5 Managers + 45 Employees)
  const validEmployees = (employees && employees.length > 0)
    ? employees.filter((e) => e.name !== "Aman Verma" || isAdmin)
    : [];

  const defaultManagers = [
    { name: "Rahul Sharma", designation: "Senior Engineering Manager", department: "Engineering", email: "managerpeoplepulse@gmail.com" },
    { name: "Priya Nair", designation: "Product Head", department: "Product", email: "priya.nair@peoplepulse.co" },
    { name: "Sneha Gupta", designation: "HR Director", department: "HR", email: "sneha.gupta@peoplepulse.co" },
    { name: "Rohan Kapoor", designation: "Finance Director", department: "Finance", email: "rohan.kapoor@peoplepulse.co" },
    { name: "Ananya Sen", designation: "Marketing Director", department: "Marketing", email: "ananya.sen@peoplepulse.co" },
  ];

  const dbManagers = validEmployees.filter((e) => e.role === "Manager");
  const managersList = dbManagers.length >= 5 ? dbManagers : defaultManagers;

  // Filter for Manager role to show their own department primary focus
  const displayManagers = (isManager && currentUser?.department)
    ? managersList.filter((m) => m.department.toLowerCase() === currentUser.department.toLowerCase() || m.department === "Engineering")
    : managersList;

  return (
    <>
      <SectionTitle title="Organizational Hierarchy &amp; Department Structure" />

      {/* ADMIN VIEW: FULL EXECUTIVE HEAD (AMAN VERMA) TOP CARD */}
      {isAdmin && (
        <Card style={{ marginBottom: 24, padding: 20, textAlign: "center", background: "var(--surface)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--ink-dim)", textTransform: "uppercase", marginBottom: 12 }}>
            Executive Leadership &amp; Administration
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "var(--surface-alt)", border: "2px solid #E8A33D", borderRadius: 14, padding: "14px 28px", boxShadow: "0 4px 16px rgba(232, 163, 61, 0.15)" }}>
            <div className="nf-avatar" style={{ background: "#E8A33D", color: "#000", fontWeight: 800 }}>
              AV
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>Aman Verma</span>
                <ShieldCheck size={16} color="#E8A33D" />
              </div>
              <div style={{ fontSize: 12, color: "#E8A33D", fontWeight: 700 }}>System Administrator &amp; Head</div>
              <div style={{ fontSize: 11, color: "var(--ink-dim)", marginTop: 2 }}>adminpeoplepulse@gmail.com</div>
            </div>
          </div>
          <div style={{ width: 2, height: 24, background: "var(--border)", margin: "16px auto 0" }} />
        </Card>
      )}

      <Card style={{ padding: 24, overflowX: "auto" }}>
        <div style={{ fontSize: 12, color: "var(--ink-dim)", marginBottom: 20, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Users size={15} color="#2F8F82" />
          <span>Showing 5 Department Managers and 10 Team Members reporting to each Manager</span>
        </div>

        {/* GRID OF 5 DEPARTMENTS (1 MANAGER + 10 EMPLOYEES EACH) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {displayManagers.map((mgr) => {
            const deptEmployees = validEmployees.filter(
              (e) => e.role === "Employee" && e.department === mgr.department
            );
            const color = DEPT_COLORS[mgr.department] || "#38BDF8";

            return (
              <div
                key={mgr.email || mgr.name}
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
                    border: `1.5px solid ${color}`,
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
                  Reporting Employees ({deptEmployees.length || 10})
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
