import apiClient from "./services.js";

export default {
  // Get all experiences for a specific user
  fetchUsers(userId) {
    console.log("services - fetching users");
    return apiClient.get(`/users`);
  },
    
};