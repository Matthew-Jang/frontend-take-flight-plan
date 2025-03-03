import apiClient from "./apiClient";

export default {
  getAllEvents() {
    return apiClient.get("/api/events");
  },
  getEventById(eventId) {
    return apiClient.get(`/api/events/${eventId}`);
  },
  createEvent(eventData) {
    return apiClient.post("/api/events", eventData);
  },
  updateEvent(eventId, eventData) {
    return apiClient.put(`/api/events/${eventId}`, eventData);
  },
  deleteEvent(eventId) {
    return apiClient.delete(`/api/events/${eventId}`);
  }
};
