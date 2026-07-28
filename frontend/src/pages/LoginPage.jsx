import React, { useState } from "react";
import { Sun, Moon, CheckCircle2, AlertCircle, UserPlus, LogIn } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { registerUserAPI } from "../services/api";

export function LoginPage({ onLogin }) {
  const { dark, toggleTheme } = useTheme();
  const [mode, setMode] = useState("signin"); // "signin" or "register"
  
  // Sign-in states
  const [email, setEmail] = useState("vanshikapeoplepulse@gmail.com");
  const [password, setPassword] = useState("••••••••");
  
  // Registration states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regDesignation, setRegDesignation] = useState("Frontend Developer");
  const [regDepartment, setRegDepartment] = useState("Engineering");
  
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);
    
    if (mode === "signin") {
      try {
        await onLogin("Employee", { email, password });
      } catch (err) {
        setErrorMessage(err?.response?.data?.message || err.message || "Invalid credentials or unapproved account.");
      }
    } else {
      setIsSubmitting(true);
      try {
        const res = await registerUserAPI({
          name: regName,
          email: regEmail,
          password: regPassword,
          designation: regDesignation,
          department: regDepartment,
          role: "Employee",
        });
        setStatusMessage(res.message || "Registration submitted! Pending Admin authorization.");
        setMode("signin");
        setEmail(regEmail);
        setRegName("");
        setRegEmail("");
        setRegPassword("");
      } catch (err) {
        setErrorMessage(err?.response?.data?.message || err.message || "Registration failed. Try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
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

      <div className="nf-login-card" style={{ maxWidth: 480, width: "100%", padding: "44px 40px" }}>
        <div className="nf-login-brand-centered" style={{ gap: 12 }}>
          <img src="/brand-icon.svg" alt="Brand Logo" style={{ width: 48, height: 48 }} />
          <span style={{ fontSize: 24, fontWeight: 700 }}>PeoplePulse</span>
        </div>
        <p className="nf-login-tagline" style={{ marginTop: 6, marginBottom: 20, fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "var(--ink-dim)" }}>
          Empowering smarter workforce engagement
        </p>

        {/* Mode Switcher Tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, background: "var(--surface-alt)", padding: 4, borderRadius: 10, marginBottom: 20 }}>
          <button
            type="button"
            className="nf-btn"
            style={{
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              background: mode === "signin" ? "var(--accent)" : "transparent",
              color: mode === "signin" ? "#000" : "var(--ink-dim)",
              border: "none",
            }}
            onClick={() => { setMode("signin"); setErrorMessage(null); }}
          >
            <LogIn size={14} /> Sign In
          </button>
          <button
            type="button"
            className="nf-btn"
            style={{
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              background: mode === "register" ? "var(--accent)" : "transparent",
              color: mode === "register" ? "#000" : "var(--ink-dim)",
              border: "none",
            }}
            onClick={() => { setMode("register"); setErrorMessage(null); }}
          >
            <UserPlus size={14} /> Request Access
          </button>
        </div>

        {statusMessage && (
          <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 14px", borderRadius: 8, color: "#2F8F82", fontSize: 12.5, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={16} /> {statusMessage}
          </div>
        )}

        {errorMessage && (
          <div style={{ background: "#EF444422", border: "1px solid #EF4444", padding: "10px 14px", borderRadius: 8, color: "#EF4444", fontSize: 12.5, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertCircle size={16} /> {errorMessage}
          </div>
        )}

        {mode === "signin" ? (
          <form onSubmit={handleSubmit}>
            <label className="nf-field">Work Email
              <input className="nf-select" placeholder="you@peoplepulse.co" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className="nf-field">Password
              <input className="nf-select" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <div className="nf-login-row">
              <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12.5, color: "var(--ink-dim)" }}>
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <a className="nf-link" href="#">Forgot password?</a>
            </div>

            <button type="submit" className="nf-btn primary nf-signin-btn" style={{ padding: "12px 16px", fontSize: 14, width: "100%", marginTop: 10 }}>
              Sign in
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="nf-field">Full Name
              <input className="nf-select" placeholder="e.g. Ananya Roy" value={regName} onChange={(e) => setRegName(e.target.value)} required />
            </label>
            <label className="nf-field">Work Email
              <input className="nf-select" type="email" placeholder="ananya.roy@peoplepulse.co" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
            </label>
            <label className="nf-field">Create Password
              <input className="nf-select" type="password" placeholder="••••••••" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <label className="nf-field" style={{ flex: 1 }}>Designation
                <input className="nf-select" placeholder="e.g. Developer" value={regDesignation} onChange={(e) => setRegDesignation(e.target.value)} required />
              </label>
              <label className="nf-field" style={{ flex: 1 }}>Department
                <select className="nf-select" value={regDepartment} onChange={(e) => setRegDepartment(e.target.value)}>
                  <option>Engineering</option>
                  <option>HR</option>
                  <option>Finance</option>
                  <option>Marketing</option>
                </select>
              </label>
            </div>

            <button type="submit" className="nf-btn primary nf-signin-btn" disabled={isSubmitting} style={{ padding: "12px 16px", fontSize: 14, width: "100%", marginTop: 10 }}>
              {isSubmitting ? "Submitting Request..." : "Submit Registration Request"}
            </button>
          </form>
        )}

        <div className="nf-login-divider" style={{ marginTop: 20 }}><span>fill credentials for</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <button
            type="button"
            className="nf-btn ghost sm"
            style={{ fontSize: 11.5, justifyContent: "center" }}
            onClick={() => {
              setMode("signin");
              setEmail("adminpeoplepulse@gmail.com");
              setPassword("admin123");
            }}
          >
            Admin
          </button>
          <button
            type="button"
            className="nf-btn ghost sm"
            style={{ fontSize: 11.5, justifyContent: "center" }}
            onClick={() => {
              setMode("signin");
              setEmail("managerpeoplepulse@gmail.com");
              setPassword("manager123");
            }}
          >
            Manager
          </button>
          <button
            type="button"
            className="nf-btn ghost sm"
            style={{ fontSize: 11.5, justifyContent: "center" }}
            onClick={() => {
              setMode("signin");
              setEmail("vanshikapeoplepulse@gmail.com");
              setPassword("password123");
            }}
          >
            Employee
          </button>
        </div>
      </div>
    </div>
  );
}
