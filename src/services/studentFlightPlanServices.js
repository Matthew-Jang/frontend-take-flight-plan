// src/services/studentFlightPlanServices.js

import apiClient from "./services.js";

export default {
  /**
   * Generate a flight plan for the given student.
   * POST /flight-plan-t4/student_flight_plan_items/generate
   */
  generate(studentId) {
    return apiClient.post(
      "/student_flight_plan_items/generate",
      { student_id: studentId }
    );
  },

  /**
   * Fetch this student's flight plan items, including checklist details.
   * GET /flight-plan-t4/student_flight_plan_items?student_id=…&includeChecklist=true
   */
  fetchByStudent(studentId) {
    return apiClient.get("/student_flight_plan_items", {
      params: {
        student_id: studentId,
        includeChecklist: true
      }
    });
  },

  /**
   * Mark a flight plan item complete (with optional file upload).
   * PUT /flight-plan-t4/student_flight_plan_items/:id/complete
   */
  complete(itemId, file = null) {
    const form = new FormData();
    form.append("state", "Completed");
    if (file) {
      form.append("file", file);
    }
    // ← let axios set Content-Type and boundary automatically:
    return apiClient.put(
      `/student_flight_plan_items/${itemId}/complete`,
      form
    );
  },

  /**
   * Fetch all pending submissions for admin review.
   * GET /flight-plan-t4/student_flight_plan_items?state=Completed&pendingApproval=true
   */
  fetchPending() {
    return apiClient.get("/student_flight_plan_items", {
      params: {
        state: "Completed",
        pendingApproval: true,
        includeStudent: true,
        includeChecklist: true
      }
    });
  },

  /**
   * Approve or deny a student's submission.
   * PUT /flight-plan-t4/student_flight_plan_items/:id
   * Body: { admin_approval: 1 } or { admin_approval: 0 }
   */
  review(itemId, approval) {
    return apiClient.put(
      `/student_flight_plan_items/${itemId}`,
      { admin_approval: approval }
    );
  },

  updateState(itemId, newState) {
    return apiClient.put(
      `/student_flight_plan_items/${itemId}`,
      { state: newState }
    );
  }
};
