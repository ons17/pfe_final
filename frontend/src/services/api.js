// File: src/services/api.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  // User authentication
  getCurrentUser() {
    return apiClient.get("/api/current-user");
  },
  logout() {
    return apiClient.get("/logout");
  },

  // Additional API calls can be added here as needed
  // For example:
  getUsers() {
    return apiClient.get("/admin/users");
  },

  updateUser(userId, userData) {
    return apiClient.put(`/admin/users/${userId}`, userData);
  },
};
