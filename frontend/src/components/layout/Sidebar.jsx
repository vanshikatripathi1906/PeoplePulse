import React from "react";
import {
  LayoutDashboard, Users, Clock, CalendarDays, Building2, ListChecks, Star,
  Network, Wallet, Bell, LogOut, User, Search, Laptop, DoorOpen
} from "lucide-react";

export const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Admin", "Manager", "Employee"] },
  { key: "directory", label: "Directory", icon: Users, roles: ["Admin", "Manager"] },
  { key: "profile", label: "My Profile", icon: User, roles: ["Manager", "Employee"] },
  { key: "attendance", label: "Attendance", icon: Clock, roles: ["Manager", "Employee"] },
  { key: "leave", label: "Leave", icon: CalendarDays, roles: ["Admin", "Manager", "Employee"] },
  { key: "departments", label: "Departments", icon: Building2, roles: ["Admin", "Manager"] },
  { key: "tasks", label: "Tasks", icon: ListChecks, roles: ["Admin", "Manager", "Employee"] },
  { key: "performance", label: "Performance", icon: Star, roles: ["Admin", "Manager", "Employee"] },
  { key: "aisearch", label: "Skill Search", icon: Search, roles: ["Manager"] },
  { key: "assets", label: "Assets", icon: Laptop, roles: ["Admin"] },
  { key: "rooms", label: "Meeting Rooms", icon: DoorOpen, roles: ["Admin"] },
  { key: "orgchart", label: "Org Chart", icon: Network, roles: ["Admin", "Manager", "Employee"] },
  { key: "payroll", label: "Payroll", icon: Wallet, roles: ["Manager", "Employee"] },
  { key: "notifications", label: "Notifications", icon: Bell, roles: ["Admin", "Manager", "Employee"] },
];

export function Sidebar({ role, page, setPage, onLogout }) {
  const items = NAV_ITEMS.filter((n) => role && n.roles.includes(role));

  return (
    <aside className="nf-sidebar">
      <div className="nf-sidebar-brand">
        <img src="/brand-icon.svg" alt="Brand" style={{ width: 28, height: 28 }} />
        <span>PeoplePulse</span>
      </div>
      {items.map((n) => {
        const Icon = n.icon;
        const isActive = page === n.key || (n.key === "directory" && page === "empProfile");
        return (
          <div
            key={n.key}
            className={`nf-navitem ${isActive ? "active" : ""}`}
            onClick={() => setPage(n.key)}
          >
            <Icon size={16} /> {n.label}
          </div>
        );
      })}
      <div className="nf-sidebar-foot">
        <div className="nf-avatar sm" style={{ background: "rgba(255,255,255,.12)" }}>
          {role ? role[0] : "U"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>{role} account</div>
          <div style={{ fontSize: 10.5, color: "#94A3B8" }}>Session active</div>
        </div>
        <LogOut size={15} style={{ cursor: "pointer", opacity: 0.7 }} onClick={onLogout} />
      </div>
    </aside>
  );
}
