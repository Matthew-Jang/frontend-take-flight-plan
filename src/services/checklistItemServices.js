import apiClient from "./services.js";

export default {
  create(data) {
    console.log("services - creating checklist item");
    return apiClient.post(`/checklist_items`, data);
  },

  fetchAll() {
    console.log("services - fetching checklist items");
    return apiClient.get(`/checklist_items`);
  },

  fetchOne(checklistItemId) {
    console.log("services - fetching checklist item with id " + checklistItemId);
    return apiClient.get(`/checklist_items/${checklistItemId}`);
  },

  update(checklistItemId, data) {
    console.log("services - updating checklist item with id " + checklistItemId);
    return apiClient.put(`/checklist_items/${checklistItemId}`, data);
  },

  delete(checklistItemId) {
    console.log("services - deleting checklist item with id " + checklistItemId);
    return apiClient.delete(`/checklist_items/${checklistItemId}`);
  },

  deleteAll() {
    console.log("services - deleting all checklist items");
    return apiClient.delete(`/checklist_items`);
  },
};
