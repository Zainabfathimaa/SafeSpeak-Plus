/**
 * ===================================
 * AUTHENTICATION ROUTES (routes/authRoutes.js)
 * ===================================
 * 
 * PURPOSE:
 * Defines all authentication endpoints (URLs)
 * Maps URLs to controller functions
 * 
 * ANALOGY:
 * Routes = Menu items (what customer can request)
 * Controllers = Kitchen (what happens when ordered)
 * Database = Pantry (where ingredients/data stored)
 * 
 * WHAT THIS FILE DOES:
 * 1. Import Express router
 * 2. Import controller functions
 * 3. Import middleware
 * 4. Define routes (GET, POST, PUT, DELETE)
 * 5. Attach middleware to routes (like guards)
 * 6. Export router to use in server.js
 * 
 * HTTP METHODS:
 * GET    = Read data (no body usually)
 * POST   = Create data
 * PUT    = Update data
 * DELETE = Remove data
 * PATCH  = Partial update
 */

import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

// Create a router object
// This router will handle all /api/auth routes
const router = express.Router();

/**
 * ===================================
 * ROUTE 1: POST /api/auth/register
 * ===================================
 * 
 * PURPOSE: User registration
 * 
 * WHAT HAPPENS:
 * 1. User submits registration form
 * 2. Frontend makes POST request to this endpoint
 * 3. Backend receives email, password
 * 4. Validate inputs
 * 5. Create user in database
 * 6. Generate anonymous code
 * 7. Return success response
 * 
 * FRONTEND REQUEST:
 * POST http://localhost:5000/api/auth/register
 * Headers: { "Content-Type": "application/json" }
 * Body: {
 *   "email": "student@college.edu",
 *   "password": "SecurePassword123",
 *   "confirmPassword": "SecurePassword123"
 * }
 * 
 * BACKEND RESPONSE (Success):
 * Status: 201 Created
 * Body: {
 *   "success": true,
 *   "message": "Registration successful",
 *   "user": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "email": "student@college.edu",
 *     "anonymousCode": "A7X-992-B4Q"
 *   }
 * }
 * 
 * BACKEND RESPONSE (Error):
 * Status: 400 Bad Request
 * Body: {
 *   "success": false,
 *   "message": "Email already registered"
 * }
 * 
 * SECURITY:
 * - Public route (no authentication needed)
 * - Password encrypted in controller before saving
 * - Email validation
 * - Duplicate email check
 */
router.post('/register', authController.register);

/**
 * ===================================
 * ROUTE 2: POST /api/auth/login
 * ===================================
 * 
 * PURPOSE: User login with email & password
 * 
 * WHAT HAPPENS:
 * 1. User submits login form
 * 2. Frontend makes POST request
 * 3. Backend finds user by email
 * 4. Compares password with bcrypt
 * 5. If match, create JWT token
 * 6. Return token to frontend
 * 7. Frontend stores token for future requests
 * 
 * FRONTEND REQUEST:
 * POST http://localhost:5000/api/auth/login
 * Headers: { "Content-Type": "application/json" }
 * Body: {
 *   "email": "student@college.edu",
 *   "password": "SecurePassword123"
 * }
 * 
 * BACKEND RESPONSE (Success):
 * Status: 200 OK
 * Body: {
 *   "success": true,
 *   "message": "Login successful",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "email": "student@college.edu"
 *   }
 * }
 * 
 * BACKEND RESPONSE (Error):
 * Status: 401 Unauthorized
 * Body: {
 *   "success": false,
 *   "message": "Invalid email or password"
 * }
 * 
 * TOKEN USAGE:
 * After getting token, frontend stores it:
 * localStorage.setItem('token', token);
 * 
 * For protected requests, include token:
 * fetch(url, {
 *   headers: {
 *     'Authorization': 'Bearer ' + token
 *   }
 * });
 * 
 * SECURITY:
 * - Public route (no authentication needed)
 * - Password compared with bcrypt (no plain comparison)
 * - Token expires in 7 days
 * - Token signed with secret only server knows
 */
router.post('/login', authController.login);

/**
 * ===================================
 * ROUTE 3: POST /api/auth/anonymous-login
 * ===================================
 * 
 * PURPOSE: User login with anonymous code
 * 
 * WHAT HAPPENS:
 * 1. User submits anonymous code
 * 2. Backend finds user with that code
 * 3. Creates JWT token
 * 4. Returns token
 * 
 * ANONYMOUS CODE FORMAT: ABC-123-DEF
 * - 6 letters + 3 numbers + 3 letters
 * - Generated during registration
 * - User gets code via email
 * - User saves code securely
 * - User can login anytime with code
 * 
 * FRONTEND REQUEST:
 * POST http://localhost:5000/api/auth/anonymous-login
 * Headers: { "Content-Type": "application/json" }
 * Body: {
 *   "anonymousCode": "A7X-992-B4Q"
 * }
 * 
 * BACKEND RESPONSE (Success):
 * Status: 200 OK
 * Body: {
 *   "success": true,
 *   "message": "Anonymous login successful",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": "507f1f77bcf86cd799439011"
 *   }
 * }
 * 
 * BACKEND RESPONSE (Error):
 * Status: 401 Unauthorized
 * Body: {
 *   "success": false,
 *   "message": "Invalid anonymous code"
 * }
 * 
 * WHY ANONYMOUS LOGIN?
 * - Users don't need to remember password
 * - Code is unique to each user
 * - No password storage on client needed
 * - Extra security for anonymous reporting
 * 
 * SECURITY:
 * - Code is 12 characters long
 * - Random generation (A-Z, 0-9)
 * - Unique per user
 * - Can be treated like a second password
 */
router.post('/anonymous-login', authController.anonymousLogin);

/**
 * ===================================
 * ROUTE 4: GET /api/auth/me (PROTECTED)
 * ===================================
 * 
 * PURPOSE: Get current logged-in user info
 * 
 * WHAT HAPPENS:
 * 1. Frontend has JWT token
 * 2. Frontend sends request with token
 * 3. Middleware verifies token
 * 4. Controller returns user info
 * 
 * FRONTEND REQUEST:
 * GET http://localhost:5000/api/auth/me
 * Headers: {
 *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 * BACKEND RESPONSE (Success):
 * Status: 200 OK
 * Body: {
 *   "success": true,
 *   "user": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "email": "student@college.edu",
 *     "fullName": "John Doe",
 *     "role": "user"
 *   }
 * }
 * 
 * BACKEND RESPONSE (Error):
 * Status: 401 Unauthorized
 * Body: {
 *   "success": false,
 *   "message": "No authorization token provided"
 * }
 * 
 * WHY PROTECTED?
 * - Only logged-in users can use this
 * - Token proves they're authenticated
 * - Without token, request rejected
 * 
 * 'authenticate' MIDDLEWARE:
 * - Runs BEFORE route handler
 * - Checks for valid token
 * - Sets req.user if token valid
 * - Returns 401 if token invalid/missing
 * 
 * EXECUTION ORDER:
 * Request → authenticate middleware
 *        ↓ (if valid token)
 *        → authController.getCurrentUser
 *        → Response sent
 *
 * OR
 *
 * Request → authenticate middleware
/**
 * ===================================
 * ROUTE 4: POST /api/auth/verify-email
 * ===================================
 * 
 * PURPOSE: Verify email and get anonymous code
 * 
 * WHAT HAPPENS:
 * 1. User clicks email verification link
 * 2. Link contains verification token
 * 3. Frontend sends POST with token
 * 4. Backend marks email as verified
 * 5. Backend generates anonymous code
 * 6. Frontend shows code to user
 * 
 * FRONTEND SENDS:
 * POST /api/auth/verify-email
 * {
 *   "token": "abc123token..."
 * }
 * 
 * BACKEND RESPONDS:
 * Success (200):
 * {
 *   "success": true,
 *   "message": "Email verified successfully! Your anonymous access code:",
 *   "anonymousCode": "ABC-123-DEF",
 *   "user": { "id": "...", "email": "..." }
 * }
 * 
 * Error (400):
 * {
 *   "success": false,
 *   "message": "Invalid or expired verification token"
 * }
 * 
 * FLOW:
 * 1. User submits email + password → /register endpoint
 * 2. Backend sends email with verification link
 * 3. User clicks link in email
 * 4. Link goes to frontend with ?token=abc123...
 * 5. Frontend makes POST to /verify-email with token
 * 6. Backend verifies email, generates code
 * 7. Frontend shows code to user
 * 8. User can now login with code or email
 */
router.post('/verify-email', authController.verifyEmail);

/**
 * GET /api/auth/me
 * Verify JWT token and return user info
 * Header: Authorization: Bearer <token>
 * 
 * Response:
 *        → User found: {success: true, user: {...}}
 *        ↓ (if invalid token)
 *        → Returns 401 error
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * ===================================
 * ADVANCED ROUTES (Can add later)
 * ===================================
 * 
 * Logout (Frontend side - just delete token):
 * POST /api/auth/logout
 * (No backend logic needed, frontend deletes localStorage item)
 * 
 * Refresh Token:
 * POST /api/auth/refresh
 * (Return new token if old one expiring soon)
 * 
 * Forgot Password:
 * POST /api/auth/forgot-password
 * (Send reset link to email)
 * 
 * Reset Password:
 * POST /api/auth/reset-password/:token
 * (User clicks email link, resets password)
 * 
 * Verify Email:
 * GET /api/auth/verify-email/:token
 * (User clicks email link to verify)
 */

/**
 * ===================================
 * ROUTE SUMMARY TABLE
 * ===================================
 * 
 * | Method | Route              | Auth? | Purpose               |
 * |--------|-------------------|-------|----------------------|
 * | POST   | /api/auth/register | No    | Create new account    |
 * | POST   | /api/auth/login    | No    | Login with credentials|
 * | POST   | /anonymous-login   | No    | Login with code       |
 * | GET    | /api/auth/me       | Yes   | Get user info         |
 * 
 */

/**
 * Export router to use in server.js
 * 
 * In server.js:
 * import authRoutes from './routes/authRoutes.js';
 * app.use('/api/auth', authRoutes);
 * 
 * This means:
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - POST /api/auth/anonymous-login
 * - GET /api/auth/me
 */
export default router;

/**
 * ===================================
 * HOW ROUTING WORKS
 * ===================================
 * 
 * FILE STRUCTURE:
 * server.js (main file)
 * ├─ import authRoutes from './routes/authRoutes.js'
 * ├─ app.use('/api/auth', authRoutes)
 * │
 * └─ authRoutes.js (this file)
 *    ├─ import authController from './controllers/authController.js'
 *    ├─ import { authenticate } from './middleware/auth.js'
 *    │
 *    └─ router.post('/register', authController.register)
 *       router.post('/login', authController.login)
 *       router.get('/me', authenticate, authController.getCurrentUser)
 * 
 * RESULTING URLS:
 * POST   /api/auth/register
 * POST   /api/auth/login
 * POST   /api/auth/anonymous-login
 * GET    /api/auth/me (protected)
 * 
 * REQUEST FLOW EXAMPLE:
 * 1. Frontend: POST /api/auth/login
 * 2. Express Router: Match route → call controller
 * 3. Controller (authController.login):
 *    - Extract email, password
 *    - Find user in database
 *    - Compare passwords
 *    - Create token
 *    - Send response
 * 4. Frontend receives token
 * 5. Stores token in localStorage
 * 6. Uses token for future requests
 * 
 * REQUEST FLOW WITH MIDDLEWARE:
 * 1. Frontend: GET /api/auth/me with token
 * 2. Express Router: Match route → run middleware
 * 3. Middleware (authenticate):
 *    - Extract token from header
 *    - Verify token
 *    - If valid: set req.user and call next()
 *    - If invalid: return 401 error
 * 4. If middleware passed: Controller runs
 * 5. Controller (authController.getCurrentUser):
 *    - Use req.user set by middleware
 *    - Get user info from database
 *    - Send response
 * 6. Frontend receives user info
 * 
 * MIDDLEWARE CONCEPT:
 * Think of middleware as security checkpoints
 * Some routes have checkpoints (protected)
 * Some routes have no checkpoints (public)
 * 
 * Public route:
 * Request → Route Handler → Response
 * 
 * Protected route:
 * Request → Middleware (check) → Route Handler → Response
 *                  ↓ (fail)
 *           Return error
 */
