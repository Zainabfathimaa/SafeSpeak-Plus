import { makeRequest } from './authService';

export const getAnalytics = async () => {
    return makeRequest('/analytics', {
        method: 'GET'
    });
};

export default { getAnalytics };
