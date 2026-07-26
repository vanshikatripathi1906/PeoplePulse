import React, { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function LoginPage({ onLogin }) {
  const { dark, toggleTheme } = useTheme();
  const [email, setEmail] = useState("vanshika.t@peoplepulse.co");
  const [password, setPassword] = useState("••••••••");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin("Employee", { email, password });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top right, #1E293B, #090B13 70%)",
        position: "relative",
        overflow: "hidden",
        padding: 20,
      }}
    >
      <button className="nf-theme-toggle floating" onClick={toggleTheme}>
        {dark ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      <div className="nf-login-card" style={{ maxWidth: 460, width: "100%", padding: "44px 40px" }}>
        <div className="nf-login-brand-centered" style={{ gap: 12 }}>
          <img src="/brand-icon.svg" alt="Brand Logo" style={{ width: 48, height: 48 }} />
          <span style={{ fontSize: 24, fontWeight: 700 }}>PeoplePulse</span>
        </div>
        <p className="nf-login-tagline" style={{ marginTop: 6, marginBottom: 24, fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "var(--ink-dim)" }}>
          Empowering smarter workforce engagement
        </p>

        <div style={{ textAlign: "center", marginBottom: 14, fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "var(--ink-dim)", fontWeight: 500 }}>
          Welcome back
        </div>

        <form onSubmit={handleSubmit}>
          <label className="nf-field">Email
            <input className="nf-select" placeholder="you@peoplepulse.co" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="nf-field">Password
            <input className="nf-select" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <div className="nf-login-row">
            <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12.5, color: "var(--ink-dim)" }}>
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <a className="nf-link" href="#">Forgot password?</a>
          </div>

          <button type="submit" className="nf-btn primary nf-signin-btn" style={{ padding: "12px 16px", fontSize: 14 }}>
            Sign in
          </button>
        </form>

        <div className="nf-login-divider" style={{ marginTop: 32 }}><span>choose a role</span></div>
        <div className="nf-role-row">
          {["Admin", "Manager", "Employee"].map((r) => (
            <button key={r} className="nf-btn primary" onClick={() => onLogin(r, { email, password })}>{r}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
