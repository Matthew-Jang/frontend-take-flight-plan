// src/services/DepartmentService.js
import axios from 'axios';

// Adjust base URL to match your API endpoint
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:8080/api';

class DepartmentService {
  /**
   * Get all departments
   * @returns {Promise} - Promise with departments data
   */
  getAll() {
    return axios.get(`${API_URL}/departments`);
  }

  /**
   * Get a single department by ID
   * @param {Number} id - Department ID
   * @returns {Promise} - Promise with department data
   */
  get(id) {
    return axios.get(`${API_URL}/departments/${id}`);
  }
}

export default new DepartmentService();
