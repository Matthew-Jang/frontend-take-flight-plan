// src/services/studentBadgeServices.js
import apiClient from "./services.js";

export default {
  /**
   * Award a badge to a student.
   * POST /flight-plan-t4/student_badges/award
   * Body: { student_id, badge_id }
   */
  award(studentId, badgeId) {
    return apiClient.post("/student_badges/award", {
      student_id: studentId,
      badge_id:   badgeId
    });
  },

  /**
   * List all badges for a given student.
   * GET /flight-plan-t4/student_badges?student_id=…
   */
  list(studentId) {
    return apiClient.get("/student_badges", {
      params: { student_id: studentId }
    });
  }
};
