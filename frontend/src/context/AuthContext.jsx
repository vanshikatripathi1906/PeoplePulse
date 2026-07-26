import React, { createContext, useState, useContext } from "react";
import { loginAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedRole = localStorage.getItem("role");
      if (savedToken && savedRole) {
        return {
          role: savedRole,
          name: savedRole === "Admin" ? "Aman Verma" : savedRole === "Manager" ? "Rahul Sharma" : "Vanshika Tripathi",
          token: savedToken,
        };
      }
    } catch (e) {
      console.error("Failed loading auth session from localStorage", e);
    }
    return null;
  });

  const login = async (role, credentials) => {
    const selectedRole = role || "Employee";
    try {
      const data = await loginAPI({ role: selectedRole, ...credentials });
      const userObj = {
        role: selectedRole,
        name: data?.name || (selectedRole === "Admin" ? "Aman Verma" : selectedRole === "Manager" ? "Rahul Sharma" : "Vanshika Tripathi"),
        token: data?.token || "demo-jwt-token",
      };
      setUser(userObj);
      localStorage.setItem("token", userObj.token);
      localStorage.setItem("role", selectedRole);
    } catch (err) {
      // Fallback mock session for instant demo login
      const mockUser = {
        role: selectedRole,
        name: selectedRole === "Admin" ? "Aman Verma" : selectedRole === "Manager" ? "Rahul Sharma" : "Vanshika Tripathi",
        token: "demo-jwt-token",
      };
      setUser(mockUser);
      localStorage.setItem("token", mockUser.token);
      localStorage.setItem("role", selectedRole);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || "Employee", login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
