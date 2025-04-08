// src/services/MajorService.js
import apiClient from "./services.js";

export default {
  /**
   * Create a new major
   * @param {Object} data - Major data
   * @returns {Promise}
   */
  create(data) {
    console.log("services - creating major");
    return apiClient.post(`/majors`, data);
  },

  /**
   * Fetch all majors
   * @returns {Promise}
   */
  fetchAll() {
    console.log("services - fetching majors");
    return apiClient.get(`/majors`);
  },

  /**
   * Fetch one major by ID
   * @param {Number|String} id - Major ID
   * @returns {Promise}
   */
  fetchOne(id) {
    console.log("services - fetching major with id " + id);
    return apiClient.get(`/majors/${id}`);
  },

  /**
   * Update an existing major
   * @param {Number|String} id - Major ID
   * @param {Object} data - Updated major data
   * @returns {Promise}
   */
  update(id, data) {
    console.log("services - updating major with id " + id);
    return apiClient.put(`/majors/${id}`, data);
  },

  /**
   * Delete a major
   * @param {Number|String} id - Major ID
   * @returns {Promise}
   */
  delete(id) {
    console.log("services - deleting major with id " + id);
    return apiClient.delete(`/majors/${id}`);
  },
};
