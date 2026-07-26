import React from "react";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard Render Error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#090B13", color: "#F1F5F9", padding: 30, textAlign: "center" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>System Display Reset Required</h2>
          <p style={{ color: "#94A3B8", maxWidth: 500, marginBottom: 24, fontSize: 14 }}>
            A temporary component state discrepancy occurred. Click below to synchronize your application state cleanly.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: "12px 24px",
              background: "#E8A33D",
              color: "#090B13",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Synchronize &amp; Load Dashboard
          </button>
          {this.state.error && (
            <pre style={{ marginTop: 24, padding: 16, background: "#131726", border: "1px solid #F43F5E", borderRadius: 8, color: "#F43F5E", fontSize: 12, textAlign: "left", maxWidth: 700, overflow: "auto" }}>
              {this.state.error.toString()}
              {"\n"}
              {this.state.error.stack}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const { user, login, logout } = useAuth();
  const { dark } = useTheme();

  return (
    <div data-theme={dark ? "dark" : "light"} className="nf-root">
      <ErrorBoundary>
        {!user ? (
          <LoginPage onLogin={login} />
        ) : (
          <DashboardPage role={user?.role || "Employee"} onLogout={logout} />
        )}
      </ErrorBoundary>
    </div>
  );
}
