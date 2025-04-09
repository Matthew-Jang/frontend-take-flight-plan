import apiClient from "./apiClient"; // Default import

export default {
  getAllEvents() {
    console.log("in get all events services")
    return apiClient.get("/events");
  },
  getEventById(eventId) {
    return apiClient.get(`/events/${eventId}`);
  },
  createEvent(eventData) {
    return apiClient.post("/events", eventData);
  },
  updateEvent(eventId, eventData) {
    return apiClient.put(`/events/${eventId}`, eventData);
  },
  deleteEvent(eventId) {
    return apiClient.delete(`/events/${eventId}`);
  },
};
