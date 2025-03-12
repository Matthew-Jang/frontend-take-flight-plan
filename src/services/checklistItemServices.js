import apiClient from "./services.js";

export default {
  createChecklistItem(data) {
    console.log("services - creating checklist item");
    return apiClient.post(`/checklist_items`, data);
  },

  fetchChecklistItems() {
    console.log("services - fetching checklist items");
    return apiClient.get(`/checklist_items`);
  },

  fetchChecklistItem(checklistItemId) {
    console.log("services - fetching checklist item with id " + checklistItemId);
    return apiClient.get(`/checklist_items/${checklistItemId}`);
  },

  updateChecklistItem(checklistItemId, data) {
    console.log("services - updating checklist item with id " + checklistItemId);
    return apiClient.put(`/checklist_items/${checklistItemId}`, data);
  },

  deleteChecklistItem(checklistItemId) {
    console.log("services - deleting checklist item with id " + checklistItemId);
    return apiClient.delete(`/checklist_items/${checklistItemId}`);
  },

  deleteAllChecklistItems() {
    console.log("services - deleting all checklist items");
    return apiClient.delete(`/checklist_items`);
  },
};
