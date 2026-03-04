import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const storyService = {
  // Submit new story
  submitStory: async (storyData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/stories/submit`, storyData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's own stories
  getUserStories: async (status = null) => {
    try {
      const url = status ? `${API_BASE_URL}/stories/my-stories?status=${status}` : `${API_BASE_URL}/stories/my-stories`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get published stories
  getPublishedStories: async (category = null) => {
    try {
      const url = category ? `${API_BASE_URL}/stories/published?category=${category}` : `${API_BASE_URL}/stories/published`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Like story
  likeStory: async (storyId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/stories/${storyId}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Unlike story
  unlikeStory: async (storyId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/stories/${storyId}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Comment on story
  commentOnStory: async (storyId, text) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/stories/${storyId}/comment`, { text });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Share story
  shareStory: async (storyId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/stories/${storyId}/share`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete story
  deleteStory: async (storyId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/stories/${storyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Get pending stories
  getPendingStories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stories/admin/pending`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Approve story
  approveStory: async (storyId, comments = '') => {
    try {
      const response = await axios.put(`${API_BASE_URL}/stories/admin/${storyId}/approve`, { comments });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Reject story
  rejectStory: async (storyId, reason, comments = '') => {
    try {
      const response = await axios.put(`${API_BASE_URL}/stories/admin/${storyId}/reject`, { reason, comments });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Get story statistics
  getStoryStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stories/admin/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default storyService;
