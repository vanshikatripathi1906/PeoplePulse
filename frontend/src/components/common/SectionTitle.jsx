import React from "react";

export const SectionTitle = ({ eyebrow, title, action }) => (
  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
    <div>
      {eyebrow && <div className="nf-eyebrow">{eyebrow}</div>}
      <h2 className="nf-h2">{title}</h2>
    </div>
    {action}
  </div>
);
