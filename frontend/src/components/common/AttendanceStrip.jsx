import React from "react";

export const STATUS_COLOR = { P: "#2F8F82", A: "#E2604F", L: "#E8A33D", WFH: "#6C6FB0", H: "#B7B2A0" };
export const STATUS_LABEL = { P: "Present", A: "Absent", L: "Leave", WFH: "Work From Home", H: "Half Day" };

export function AttendanceStrip({ data, compact }) {
  return (
    <div className="nf-strip" title="Last 28 days">
      {data.map((s, i) => (
        <span key={i} className="nf-strip-tick" style={{ background: STATUS_COLOR[s] || "#2F8F82", height: compact ? 14 : 22 }} />
      ))}
    </div>
  );
}
