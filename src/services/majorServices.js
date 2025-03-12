// src/services/MajorService.js
import axios from 'axios';

// Adjust base URL to match your API endpoint
const API_URL = 'http://localhost:3100/flight-plan-t4';

class MajorService {
  /**
   * Get all majors
   * @returns {Promise} - Promise with majors data
   */
  getAll() {
    return axios.get(`${API_URL}/majors`);
  }

  /**
   * Get a single major by ID
   * @param {Number} id - Major ID
   * @returns {Promise} - Promise with major data
   */
  get(id) {
    return axios.get(`${API_URL}/majors/${id}`);
  }

  /**
   * Create a new major
   * @param {Object} data - Major data
   * @returns {Promise} - Promise with created major
   */
  create(data) {
    return axios.post(`${API_URL}/majors`, data);
  }

  /**
   * Update an existing major
   * @param {Number} id - Major ID
   * @param {Object} data - Updated major data
   * @returns {Promise} - Promise with updated major
   */
  update(id, data) {
    return axios.put(`${API_URL}/majors/${id}`, data);
  }

  /**
   * Delete a major
   * @param {Number} id - Major ID
   * @returns {Promise} - Promise with delete status
   */
  delete(id) {
    return axios.delete(`${API_URL}/majors/${id}`);
  }
}

export default new MajorService();