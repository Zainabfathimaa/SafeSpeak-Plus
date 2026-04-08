/**
 * ===================================
 * API SERVICE FILE (frontend/src/services/authService.js)
 * ===================================
 * 
 * PURPOSE:
 * Centralized place for all authentication API calls
 * Makes code cleaner and more maintainable
 * 
 * WHY SEPARATE FILE?
 * - Don't scatter API calls across components
 * - Easy to change API URL if needed
 * - Easy to add error handling
 * - Reusable across multiple components
 * 
 * ANALOGY:
 * This file = Receptionist at front desk
 * Components = Different departments
 * Backend = Processing center
 * 
 * Receptionist takes requests from departments,
 * communicates with processing center,
 * reports back to departments.
 * 
 * HOW TO USE:
 * import { loginUser, registerUser } from '../services/authService';
 * 
 * const response = await loginUser(email, password);
 * if (response.success) {
 *   // Login successful
 *   console.log(response.token);
 * } else {
 *   // Login failed
 *   console.log(response.message);
 * }
 */

// ===================================
// CONFIGURATION
// ===================================

// Backend URL - Change this if backend is on different server
// Development: http://localhost:5000
// Production: https://api.safespeak-plus.com (example)
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
// Example: const API_BASE_URL = 'http://localhost:5000/api';

/**
 * HELPER FUNCTION: Make API Request
 * 
 * This function:
 * 1. Takes URL, method, and data
 * 2. Adds headers
 * 3. Includes token if user is logged in
 * 4. Makes fetch request
 * 5. Handles errors
 * 6. Returns response or error
 * 
 * BENEFIT: Avoids repeating fetch code in every function
 */
export const makeRequest = async (endpoint, options = {}) => {
  try {
    // Build full URL
    const url = `${API_BASE_URL}${endpoint}`;

    // Get token from storage (check session first, then local)
    // Used for authenticated requests
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');

    // Build headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers // Allow custom headers
    };

    // Add token to Authorization header if exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Make fetch request
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Parse response JSON
    const data = await response.json();

    // Check if request was successful (200-299 status)
    if (!response.ok) {
      // Request failed
      throw {
        success: false,
        message: data.message || 'Request failed',
        status: response.status,
        error: data.error
      };
    }

    // Success response
    return data;

  } catch (error) {
    // Handle network errors or parse errors
    console.error('API Error:', error);

    // If error is our custom error object, return it
    if (error.success === false) {
      return error;
    }

    // Network or parsing error
    return {
      success: false,
      message: error.message || 'Network error occurred',
      error: 'NETWORK_ERROR'
    };
  }
};

// ===================================
// EXPORT FUNCTIONS (API Endpoints)
// ===================================

/**
 * FUNCTION 1: Register User
 * 
 * Creates new user account with college email
 * 
 * FLOW:
 * 1. Frontend has: email (@cmr.edu.in) and password
 * 2. Call registerUser(email, password)
 * 3. Function sends POST to /api/auth/register
 * 4. Backend validates college email
 * 5. Backend creates user and sends verification email with code
 * 6. Function returns response
 * 7. Frontend shows success message
 * 
 * @param {string} email - User's college email (@cmr.edu.in)
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Response with user data
 * 
 * EXAMPLE RESPONSE:
 * {
 *   "success": true,
 *   "message": "Registration successful",
 *   "user": {
 *     "id": "507f...",
 *     "email": "student@cmr.edu.in"
 *   }
 * }
 * 
 * ERROR RESPONSE:
 * {
 *   "success": false,
 *   "message": "You must register with your college email (@cmr.edu.in)"
 * }
 */
export const registerUser = async (email, password) => {
  return makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password
    })
  });
};

export const registerAdmin = async (email, password, fullName) => {
  return makeRequest('/auth/admin-register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      fullName
    })
  });
};

/**
 * FUNCTION 2: Login User (Email & Password)
 * 
 * Authenticates user with email and password
 * Returns JWT token
 * 
 * FLOW:
 * 1. Frontend has: email, password
 * 2. Call loginUser(email, password)
 * 3. Function sends POST to /api/auth/login
 * 4. Backend finds user and verifies password
 * 5. Backend creates JWT token
 * 6. Function returns response with token
 * 7. Frontend stores token in localStorage
 * 
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Response with JWT token
 * 
 * EXAMPLE RESPONSE:
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": "507f...",
 *     "email": "test@college.edu"
 *   }
 * }
 */
export const loginUser = async (email, password) => {
  return makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password
    })
  });
};

/**
 * FUNCTION 3: Anonymous Login
 * 
 * Authenticates user with anonymous code
 * Returns JWT token
 * 
 * FLOW:
 * 1. User has anonymous code (from registration email)
 * 2. Call anonymousLogin(code)
 * 3. Function sends POST to /api/auth/anonymous-login
 * 4. Backend finds user with code
 * 5. Backend creates JWT token
 * 6. Function returns response with token
 * 7. Frontend stores token
 * 
 * @param {string} anonymousCode - The anonymous access code (e.g., "A7X-992-B4Q")
 * @returns {Promise<Object>} - Response with JWT token
 * 
 * EXAMPLE RESPONSE:
 * {
 *   "success": true,
 *   "message": "Anonymous login successful",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": "507f..."
 *   }
 * }
 */
export const anonymousLogin = async (anonymousCode) => {
  return makeRequest('/auth/anonymous-login', {
    method: 'POST',
    body: JSON.stringify({
      anonymousCode
    })
  });
};

/**
 * FUNCTION 4: Get Current User Info
 * 
 * Gets logged-in user's information
 * Requires token in localStorage
 * 
 * FLOW:
 * 1. Frontend has token from login
 * 2. Call getCurrentUser()
 * 3. Function sends GET to /api/auth/me
 * 4. Includes token in Authorization header
 * 5. Backend verifies token
 * 6. Backend returns user info
 * 7. Frontend displays user info
 * 
 * USAGE:
 * const user = await getCurrentUser();
 * console.log(user.user.email);
 * 
 * @returns {Promise<Object>} - User information
 * 
 * EXAMPLE RESPONSE:
 * {
 *   "success": true,
 *   "user": {
 *     "id": "507f...",
 *     "email": "test@college.edu",
 *     "fullName": "John Doe",
 *     "role": "user"
 *   }
 * }
 */
export const getCurrentUser = async () => {
  return makeRequest('/auth/me', {
    method: 'GET'
  });
};

/**
 * FUNCTION 5: Logout
 * 
 * Clears authentication token
 * Runs on frontend only (no backend call needed)
 * 
 * FLOW:
 * 1. User clicks "Logout"
 * 2. Frontend calls logout()
 * 3. Removes token from localStorage
 * 4. Redirects to login page
 * 
 * USAGE:
 * logout();
 * navigate('/login');
 */

/**
 * FUNCTION: Change Password
 * 
 * Flow:
 * 1. User provides old password and new password
 * 2. Send PUT request to /api/auth/change-password
 * 
 * @param {string} oldPassword - Existing password
 * @param {string} newPassword - New password
 */
export const changePassword = async (oldPassword, newPassword) => {
  return makeRequest('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify({
      oldPassword,
      newPassword
    })
  });
};
// ===================================
// SESSION MANAGEMENT
// ===================================

/**
 * FUNCTION: Save Session
 * 
 * Centralized place to save all user session data
 * Handles "Remember Me" functionality
 * 
 * @param {string} token - JWT token
 * @param {Object} user - User object
 * @param {boolean} remember - If true, use localStorage (persistent). If false, use sessionStorage (session only).
 */
export const saveSession = (token, user, remember = false) => {
  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;

  // Save to selected storage
  storage.setItem('token', token);
  storage.setItem('user', JSON.stringify(user));

  // Clear other storage to prevent conflicts
  otherStorage.removeItem('token');
  otherStorage.removeItem('user');
};

/**
 * FUNCTION: Get User
 * 
 * Retrieves the full user object from storage
 * Checks sessionStorage first, then localStorage
 * 
 * @returns {Object|null} - User object or null
 */
export const getUser = () => {
  const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing user from storage', e);
    return null;
  }
};

/**
 * FUNCTION: Get User Role
 * 
 * Helper to quickly get the current user's role
 * 
 * @returns {string|null} - Role string (e.g., 'admin', 'user') or null
 */
export const getRole = () => {
  const user = getUser();
  return user ? user.role : null;
};

/**
 * FUNCTION: Clear Session (Logout)
 * 
 * Completely wipes all auth data from ALL storages
 */
export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('safespeak_session'); // Clear potential legacy session
};

/* Re-export clearSession as logout for backward compatibility */
export const logout = clearSession;

/**
 * FUNCTION: Save Token (Legacy support)
 * Defaults to localStorage for backward compatibility
 */
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * FUNCTION: Get Stored Token
 * Checks sessionStorage first, then localStorage
 */
export const getToken = () => {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
};

/**
 * FUNCTION: Check if User is Logged In
 */
export const isLoggedIn = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return !!token;
};

/**
 * FUNCTION: Verify Token (Advanced)
 */
export const verifyToken = async () => {
  const response = await getCurrentUser();
  return response.success;
};

// ===================================
// QUICK USAGE EXAMPLES
// ===================================

/**
 * EXAMPLE 1: Register New User
 * 
 * import { registerUser, saveToken } from './services/authService';
 * 
 * const handleRegister = async (email, password, confirmPassword) => {
 *   const response = await registerUser(email, password, confirmPassword);
 *   
 *   if (response.success) {
 *     console.log('Registration successful!');
 *     console.log('Your anonymous code:', response.user.anonymousCode);
 *     // Redirect to login after 3 seconds
 *     setTimeout(() => navigate('/login'), 3000);
 *   } else {
 *     console.error('Registration failed:', response.message);
 *     setError(response.message);
 *   }
 * };
 */

/**
 * EXAMPLE 2: Login User
 * 
 * import { loginUser, saveToken } from './services/authService';
 * 
 * const handleLogin = async (email, password) => {
 *   const response = await loginUser(email, password);
 *   
 *   if (response.success) {
 *     console.log('Login successful!');
 *     saveToken(response.token); // Store token
 *     navigate('/dashboard');
 *   } else {
 *     console.error('Login failed:', response.message);
 *     setError(response.message);
 *   }
 * };
 */

/**
 * EXAMPLE 3: Get User Info
 * 
 * import { getCurrentUser, logout } from './services/authService';
 * 
 * const handleGetUser = async () => {
 *   const response = await getCurrentUser();
 *   
 *   if (response.success) {
 *     console.log('User:', response.user);
 *     setUser(response.user);
 *   } else {
 *     console.error('Token expired or invalid');
 *     logout();
 *     navigate('/login');
 *   }
 * };
 */

/**
 * EXAMPLE 4: Protected Route
 * 
 * import { isLoggedIn } from './services/authService';
 * 
 * const ProtectedRoute = ({ children }) => {
 *   return isLoggedIn() ? children : <Navigate to="/login" />;
 * };
 * 
 * <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */

// ===================================
// ERROR CODES & MEANINGS
// ===================================

/**
 * COMMON ERRORS:
 * 
 * 'NETWORK_ERROR': Network is down or backend not running
 * 'CORS_ERROR': CORS not configured on backend
 * 'INVALID_EMAIL': Email format invalid
 * 'PASSWORD_TOO_SHORT': Password less than 6 characters
 * 'PASSWORDS_DONT_MATCH': Passwords in register don't match
 * 'EMAIL_ALREADY_REGISTERED': Email already has account
 * 'INVALID_CREDENTIALS': Email or password wrong
 * 'INVALID_CODE': Anonymous code not found
 * 'TOKEN_EXPIRED': JWT token expired (need to login again)
 * 'INVALID_TOKEN': JWT token tampered with
 * 'UNAUTHORIZED': Token missing or invalid
 */


export default {
  registerUser,
  registerAdmin,
  loginUser,
  anonymousLogin,
  getCurrentUser,
  logout,
  saveToken,
  getToken,
  isLoggedIn,
  verifyToken,
  saveSession,
  getUser,
  getRole,
  clearSession,
  makeRequest,
  changePassword
};
