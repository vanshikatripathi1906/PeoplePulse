import React from "react";
import { Card } from "./Card";

export function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <Card className="nf-stat">
      <div className="nf-stat-top">
        <span className="nf-stat-icon" style={{ background: `${accent}22`, color: accent }}>
          <Icon size={17} />
        </span>
        <span className="nf-eyebrow">{label}</span>
      </div>
      <div className="nf-stat-value">{value}</div>
      {sub && <div className="nf-stat-sub">{sub}</div>}
    </Card>
  );
}
