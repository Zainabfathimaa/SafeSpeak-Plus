import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const notificationService = {
  // Get notifications
  getNotifications: async (limit = 20, skip = 0, unreadOnly = false) => {
    try {
      const url = `${API_BASE_URL}/notifications?limit=${limit}&skip=${skip}&unreadOnly=${unreadOnly}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/count`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/notifications/mark-all-read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete all notifications
  deleteAllNotifications: async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/notifications/delete-all`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default notificationService;
