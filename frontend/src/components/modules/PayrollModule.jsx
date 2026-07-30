import React, { useState } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";
import { DEPT_COLORS } from "../common/EmployeeBadge";

export function PayrollModule({ role, self, employees, currentUser }) {
  const [notification, setNotification] = useState(null);
  
  const nonAdminEmployees = (employees || []).filter((e) => e.role !== "Admin" && e.name !== "Aman Verma");

  let list = nonAdminEmployees;
  if (role === "Employee") {
    list = self ? [self] : nonAdminEmployees;
  } else if (role === "Manager") {
    const mgrDept = (currentUser?.department || self?.department || "Engineering").toLowerCase();
    list = nonAdminEmployees.filter(
      (e) => (e.department || "").toLowerCase() === mgrDept
    );
  }

  const handleDownloadSlip = (emp) => {
    const slipContent = `===================================================================
                       PEOPLEPULSE HR PORTAL
                  OFFICIAL SALARY SLIP - JULY 2026
===================================================================

EMPLOYEE DETAILS:
-----------------
Employee Name : ${emp.name}
Employee ID   : ${emp.empId}
Department    : ${emp.department}
Designation   : ${emp.designation}
Payment Status: CREDITED (25 JUL 2026)

EARNINGS & BREAKDOWN:
---------------------
Gross Monthly Salary : ₹${emp.salary.gross.toLocaleString("en-IN")}
Performance Bonus    : ₹${emp.salary.bonus.toLocaleString("en-IN")}
-------------------------------------------------------------------
Total Gross Earnings : ₹${(emp.salary.gross + emp.salary.bonus).toLocaleString("en-IN")}

DEDUCTIONS:
-----------
Income Tax Deducted  : ₹${emp.salary.tax.toLocaleString("en-IN")}
Provident Fund (PF)  : ₹${emp.salary.pf.toLocaleString("en-IN")}
-------------------------------------------------------------------
Total Deductions     : ₹${(emp.salary.tax + emp.salary.pf).toLocaleString("en-IN")}

===================================================================
NET SALARY CREDITED  : ₹${emp.salary.net.toLocaleString("en-IN")}
===================================================================

This is an electronically generated salary slip and does not require a physical signature.
Issued by PeoplePulse Finance & Payroll Department.
`;

    const blob = new Blob([slipContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Salary_Slip_${emp.name.replace(/\s+/g, "_")}_July2026.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setNotification(`Downloaded July 2026 Salary Slip for ${emp.name}!`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <>
      <SectionTitle title="Payroll" />

      {notification && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      <div className="nf-grid-3">
        {list.map((e) => {
          const color = DEPT_COLORS[e.department] || "#2F8F82";
          return (
            <Card key={e.id || e.empId}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <div className="nf-avatar" style={{ background: `${color}26`, color }}>{e.initials}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{e.name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 12.5, color: "var(--ink-dim)", marginTop: 2 }}>{e.empId}</div>
                </div>
              </div>
              <div className="nf-payrow"><span>Salary</span><span className="nf-mono">₹{e.salary.gross.toLocaleString("en-IN")}</span></div>
              <div className="nf-payrow"><span>Tax</span><span className="nf-mono">−₹{e.salary.tax.toLocaleString("en-IN")}</span></div>
              <div className="nf-payrow"><span>Provident Fund</span><span className="nf-mono">−₹{e.salary.pf.toLocaleString("en-IN")}</span></div>
              <div className="nf-payrow"><span>Bonus</span><span className="nf-mono">+₹{e.salary.bonus.toLocaleString("en-IN")}</span></div>
              <div className="nf-payrow total"><span>Net Salary</span><span className="nf-mono">₹{e.salary.net.toLocaleString("en-IN")}</span></div>
              <button
                className="nf-btn ghost sm"
                style={{ marginTop: 10, width: "100%", justifyContent: "center" }}
                onClick={() => handleDownloadSlip(e)}
              >
                <Download size={13} /> Salary slip PDF
              </button>
            </Card>
          );
        })}
      </div>
    </>
  );
}
