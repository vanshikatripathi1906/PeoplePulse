import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL.endsWith("/api") ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
  : "/api";

const API = axios.create({
  baseURL: API_BASE,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginAPI = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

export const registerUserAPI = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const fetchPendingUsersAPI = async () => {
  const response = await API.get("/auth/pending");
  return response.data;
};

export const approveUserAPI = async (id) => {
  const response = await API.patch(`/auth/approve/${id}`);
  return response.data;
};

export const rejectUserAPI = async (id) => {
  const response = await API.patch(`/auth/reject/${id}`);
  return response.data;
};

export const fetchEmployeesAPI = async (params) => {
  const response = await API.get("/employees", { params });
  return response.data;
};

export const createEmployeeAPI = async (empData) => {
  const response = await API.post("/employees", empData);
  return response.data;
};

export const updateEmployeeAPI = async (id, empData) => {
  const response = await API.put(`/employees/${id}`, empData);
  return response.data;
};

export const deleteEmployeeAPI = async (id) => {
  const response = await API.delete(`/employees/${id}`);
  return response.data;
};

export const fetchDepartmentsAPI = async () => {
  const response = await API.get("/departments");
  return response.data;
};

export const fetchLeaveRequestsAPI = async () => {
  const response = await API.get("/leave");
  return response.data;
};

export const applyLeaveAPI = async (leaveData) => {
  const response = await API.post("/leave", leaveData);
  return response.data;
};

export const updateLeaveStatusAPI = async (id, status) => {
  const response = await API.patch(`/leave/${id}/status`, { status });
  return response.data;
};

export const fetchTasksAPI = async () => {
  const response = await API.get("/tasks");
  return response.data;
};

export const createTaskAPI = async (taskData) => {
  const response = await API.post("/tasks", taskData);
  return response.data;
};

export const updateTaskStatusAPI = async (id, status) => {
  const response = await API.patch(`/tasks/${id}/status`, { status });
  return response.data;
};

export const fetchNetworkHierarchyAPI = async () => {
  const response = await API.get("/network/hierarchy");
  return response.data;
};

export default API;
