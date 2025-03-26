import apiClient from "./services.js";

export default {

  createUser(data) {
    console.log("services - creating user");
    return apiClient.post(`/users`, data);
  },

  fetchUsers() {
    console.log("services - fetching users");
    return apiClient.get(`/users`);
  },

  updateUser(userId, data) {
    console.log("services - updating user with " + data);
    return apiClient.put(`/users/${userId}`, data);
  },

  deleteUser(userId) {
    console.log("services - deleting user " + userId);
    return apiClient.delete(`/users/${userId}`);
  },

  modifyPoints(userId, payload) {
    console.log(`services - modifying points for user ${userId}`, payload);
    return apiClient.patch(`/users/${userId}/points`, payload);
  },
};