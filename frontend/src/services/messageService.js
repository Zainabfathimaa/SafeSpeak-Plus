import { makeRequest } from './authService';

/**
 * Get all conversation threads for the currently logged-in user.
 * Admins see all report threads; regular users see only their own.
 */
export const getConversations = async () => {
    return await makeRequest('/messages', { method: 'GET' });
};

/**
 * Get all messages for a specific report thread.
 * @param {string} reportId - MongoDB _id of the report
 */
export const getMessages = async (reportId) => {
    return await makeRequest(`/messages/${reportId}`, { method: 'GET' });
};

/**
 * Send a new message on a report thread.
 * @param {string} reportId - MongoDB _id of the report
 * @param {string} text - Message body
 */
export const sendMessage = async (reportId, text) => {
    return await makeRequest(`/messages/${reportId}`, {
        method: 'POST',
        body: JSON.stringify({ text })
    });
};
