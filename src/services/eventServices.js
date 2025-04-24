import apiClient from "./apiClient"; // Default import

export default {
  // Event CRUD
  getAllEvents() {
    console.log("in get all events services");
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

  // Student signup toggles
  signupForEvent(eventId) {
    return apiClient.post(`/events/${eventId}/signup`);
  },
  unSignupForEvent(eventId) {
    return apiClient.delete(`/events/${eventId}/signup`);
  },

  // Get this user’s signups
  getMySignups() {
    return apiClient.get("/events/signups/me");
  },

  // Admin: list signups for a given event
  getEventSignups(eventId) {
    return apiClient.get(`/events/${eventId}/signups`);
  },

  // Admin: remove one user’s signup from an event
  removeSignup(eventId, userId) {
    return apiClient.delete(`/events/${eventId}/signup/${userId}`);
  },
};
