import React from "react";

export const Pill = ({ children, tone = "default" }) => (
  <span className={`nf-pill nf-pill-${tone}`}>{children}</span>
);
