import React from "react";

export const Card = ({ children, className = "", style }) => (
  <div className={`nf-card ${className}`} style={style}>
    {children}
  </div>
);
