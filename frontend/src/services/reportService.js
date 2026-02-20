import { makeRequest } from './authService';

export const createReport = async (reportData) => {
    return await makeRequest('/api/reports', {
        method: 'POST',
        body: JSON.stringify(reportData)
    });
};

export const getUserReports = async () => {
    return await makeRequest('/api/reports/my-reports', {
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
    return await makeRequest(`/api/reports${queryString}`, {
        method: 'GET'
    });
};

export const getReportById = async (id) => {
    return await makeRequest(`/api/reports/${id}`, {
        method: 'GET'
    });
};

export const updateReportStatus = async (id, statusData) => {
    return await makeRequest(`/api/reports/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(statusData)
    });
};
