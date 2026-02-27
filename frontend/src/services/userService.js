import { makeRequest } from './authService';

export const getAllUsers = async () => {
    return makeRequest('/users', {
        method: 'GET'
    });
};

export default { getAllUsers };
