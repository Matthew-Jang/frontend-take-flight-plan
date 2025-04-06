import apiClient from "./services.js";

export default {
  create(data) {
    console.log("services - creating flight_plan_items item");
    return apiClient.post(`/flight_plan_items`, data);
  },

  fetchAll() {
    console.log("services - fetching flight_plan_items items");
    return apiClient.get(`/flight_plan_items`);
  },

  fetchOne(flight_plan_item_id) {
    console.log("services - fetching flight_plan_items item with id " + flight_plan_item_id);
    return apiClient.get(`/flight_plan_items/${flight_plan_item_id}`);
  },

  update(flight_plan_item_id, data) {
    console.log("services - updating flight_plan_items item with id " + flight_plan_item_id);
    return apiClient.put(`/flight_plan_items/${flight_plan_item_id}`, data);
  },

  delete(flight_plan_item_id) {
    console.log("services - deleting flight_plan_items item with id " + flight_plan_item_id);
    return apiClient.delete(`/flight_plan_items/${flight_plan_item_id}`);
  },

  deleteAll() {
    console.log("services - deleting all flight_plan_items");
    return apiClient.delete(`/flight_plan_items`);
  },
};
