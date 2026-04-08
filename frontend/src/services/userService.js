import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/user/profile`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user preferences
  getPreferences: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/preferences`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/user/preferences`, preferences);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get ID reveal consent status
  getIdRevealConsentStatus: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/consent/status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update ID reveal consent
  updateIdRevealConsent: async (idRevealConsent) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/user/consent/id-reveal`, { idRevealConsent });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Get all users
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/all`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete current user account
  deleteAccount: async () => {
    try {
      // For DELETE requests with axios, use the config object to pass auth headers if needed
      // (assuming interceptor is already handling token)
      const response = await axios.delete(`${API_BASE_URL}/user/account`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get User Activity
  getActivity: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/activity`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default userService;
