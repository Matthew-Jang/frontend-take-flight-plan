import apiClient from "./services.js";

export default {

  create(data) {
    console.log("services - creating student");
    return apiClient.post(`/students`, data);
  },

  fetchAll() {
    console.log("services - fetching student");
    return apiClient.get(`/students`);
  },

  update(student_id, data) {
    console.log("services - updating student with " + data);
    return apiClient.put(`/students/${student_id}`, data);
  },

  delete(student_id) {
    console.log("services - deleting student " + student_id);
    return apiClient.delete(`/students/${student_id}`);
  },

};