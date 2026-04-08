import { makeRequest } from './authService';

export const createReport = async (reportData) => {
    return await makeRequest('/reports', {
        method: 'POST',
        body: JSON.stringify(reportData)
    });
};

export const getUserReports = async () => {
    return await makeRequest('/reports/my-reports', {
        method: 'GET'
    });
};

export const getAllReports = async (filters = {}) => {
    // Convert filters object to query string
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.riskLevel) queryParams.append('riskLevel', filters.riskLevel);
    if (filters.department) queryParams.append('department', filters.department);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return await makeRequest(`/reports${queryString}`, {
        method: 'GET'
    });
};

export const getReportById = async (id) => {
    return await makeRequest(`/reports/${id}`, {
        method: 'GET'
    });
};

export const updateReportStatus = async (id, statusData) => {
    return await makeRequest(`/reports/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(statusData)
    });
};

export const appealReport = async (id, appealData) => {
    return await makeRequest(`/reports/${id}/appeal`, {
        method: 'POST',
        body: JSON.stringify(appealData)
    });
};

export const escalateReport = async (id, escalateData) => {
    return await makeRequest(`/reports/${id}/escalate`, {
        method: 'POST',
        body: JSON.stringify(escalateData)
    });
};

export const getReportsByUserId = async (userId) => {
    return await makeRequest(`/reports/user/${userId}`, {
        method: 'GET'
    });
};
