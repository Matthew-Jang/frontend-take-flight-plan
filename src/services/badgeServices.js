// mrj
// need to ask matthew about the auth
//
// src/services/BadgeService.js
import axios from 'axios';

// Adjust base URL to match your API endpoint
const API_URL = 'http://localhost:3100/flight-plan-t4';

class BadgeService {
  /**
   * Get all badges
   * @returns {Promise} - Promise with badges data
   */
  getAll() {
    return axios.get(`${API_URL}/badges`);
  }

  /**
   * Get a single badge by ID
   * @param {Number} id - Badge ID
   * @returns {Promise} - Promise with badge data
   */
  get(id) {
    return axios.get(`${API_URL}/badges/${id}`);
  }

  /**
   * Create a new badge
   * @param {Object} data - Badge data
   * @returns {Promise} - Promise with created badge
   */
  create(data) {
    return axios.post(`${API_URL}/badges`, data);
  }

  /**
   * Update an existing badge
   * @param {Number} id - Badge ID
   * @param {Object} data - Updated badge data
   * @returns {Promise} - Promise with updated badge
   */
  update(id, data) {
    return axios.put(`${API_URL}/badges/${id}`, data);
  }

  /**
   * Delete a badge
   * @param {Number} id - Badge ID
   * @returns {Promise} - Promise with delete status
   */
  delete(id) {
    return axios.delete(`${API_URL}/badges/${id}`);
  }
}

export default new BadgeService();