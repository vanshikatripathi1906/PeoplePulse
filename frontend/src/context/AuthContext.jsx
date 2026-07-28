import React, { createContext, useState, useContext } from "react";
import { loginAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedRole = localStorage.getItem("role");
      const savedUser = localStorage.getItem("user_info");
      if (savedToken && savedRole) {
        return savedUser ? JSON.parse(savedUser) : {
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
        role: data?.role || selectedRole,
        name: data?.name || "Employee",
        email: data?.email,
        empId: data?.empId,
        department: data?.department,
        designation: data?.designation,
        status: data?.status || "Active",
        token: data?.token,
      };
      setUser(userObj);
      localStorage.setItem("token", userObj.token);
      localStorage.setItem("role", userObj.role);
      localStorage.setItem("user_info", JSON.stringify(userObj));
      return userObj;
    } catch (err) {
      // Throw error to block login if user is not authorized in MongoDB database
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_info");
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || "Employee", login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
