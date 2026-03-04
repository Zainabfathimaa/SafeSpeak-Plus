import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const reportAuthenticityService = {
  // Admin: Verify report authenticity
  verifyReportAuthenticity: async (reportId, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/reports/${reportId}/verify`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Set report risk level
  setReportRiskLevel: async (reportId, riskLevel) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/reports/${reportId}/risk-level`, { riskLevel });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Flag suspicious report
  flagSuspiciousReport: async (reportId, reason, notes = '') => {
    try {
      const response = await axios.put(`${API_BASE_URL}/reports/${reportId}/flag`, { reason, notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Get authenticity metrics
  getAuthenticityMetrics: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/authenticity/metrics`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Get low authenticity reports
  getLowAuthenticityReports: async (threshold = 40) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/authenticity/low-authenticity?threshold=${threshold}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default reportAuthenticityService;
