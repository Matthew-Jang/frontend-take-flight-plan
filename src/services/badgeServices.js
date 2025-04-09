// src/services/BadgeService.js
import apiClient from "./services.js";

export default {
  fetchAll() {
    console.log("services - fetching all badges");
    return apiClient.get(`/badges`);
  },

  fetchOne(badgeId) {
    console.log(`services - fetching badge ${badgeId}`);
    return apiClient.get(`/badges/${badgeId}`);
  },

  create(data) {
    console.log("services - creating badge", data);
    return apiClient.post(`/badges`, data);
  },

  update(badgeId, data) {
    console.log(`services - updating badge ${badgeId}`, data);
    return apiClient.put(`/badges/${badgeId}`, data);
  },

  delete(badgeId) {
    console.log(`services - deleting badge ${badgeId}`);
    return apiClient.delete(`/badges/${badgeId}`);
  },
};
