/**
 * ===================================
 * MAIN SERVER FILE (server.js)
 * ===================================
 * 
 * PURPOSE:
 * This is the entry point of your backend
 * Starts the Express server
 * Connects to database
 * Sets up all middleware
 * Registers all routes
 * 
 * WHAT HAPPENS:
 * 1. Load environment variables (.env file)
 * 2. Import required packages
 * 3. Import configuration files
 * 4. Import routes
 * 5. Create Express app
 * 6. Setup middleware (CORS, JSON parser, etc.)
 * 7. Connect to database
 * 8. Register API routes
 * 9. Start server on port 5000
 * 10. Listen for incoming requests
 * 
 * ANALOGY:
 * server.js = Main control center
 * It coordinates everything:
 * - Database connection
 * - Request parsing
 * - Route handling
 * - Error handling
 * - Server startup
 */

// ===================================
// STEP 1: Load Environment Variables
// ===================================

// dotenv lets us read .env file
// process.env object now has all variables from .env
import dotenv from 'dotenv';
dotenv.config();

// ===================================
// STEP 2: Import Dependencies
// ===================================

// Express: Web framework for building APIs
import express from 'express';

// CORS: Allow frontend to make requests to backend
// Without CORS, frontend on localhost:5173 can't talk to backend on localhost:5000
import cors from 'cors';

// MongoDB connection
import { connectDB } from './config/db.js';

// Authentication routes
import authRoutes from './routes/authRoutes.js';
// Report routes
import reportRoutes from './routes/reportRoutes.js';
// Message routes
import messageRoutes from './routes/messageRoutes.js';
// User routes
import userRoutes from './routes/userRoutes.js';
// Analytics routes
import analyticsRoutes from './routes/analyticsRoutes.js';
// Story routes
import storyRoutes from './routes/storyRoutes.js';
// Notification routes
import notificationRoutes from './routes/notificationRoutes.js';
// Report authenticity routes
import reportAuthenticityRoutes from './routes/reportAuthenticityRoutes.js';

// ===================================
// STEP 3: Create Express Application
// ===================================

// Create an Express app instance
// This object has methods like:
// - app.get(path, handler)
// - app.post(path, handler)
// - app.use(middleware)
// - app.listen(port)
const app = express();

// ===================================
// STEP 4: Setup Middleware (Processing Chain)
// ===================================

/**
 * WHAT IS MIDDLEWARE?
 * Functions that run for every request
 * They can:
 * - Parse request body
 * - Check authentication
 * - Log requests
 * - Handle errors
 * 
 * MIDDLEWARE CHAIN:
 * Request → Middleware 1 → Middleware 2 → Middleware 3 → Route Handler → Response
 * 
 * If middleware calls next(), continue
 * If middleware sends response, chain stops
 */

// CORS Middleware
// Allows frontend to access backend
// Without this, browser blocks requests from frontend
// 
// WHAT CORS DOES:
// 1. Check if request comes from allowed origin
// 2. If yes, add headers allowing request
// 3. If no, browser blocks request
// 
// CONFIGURATION:
// origin: List of allowed domains
// credentials: Allow sending cookies
// methods: HTTP methods allowed (GET, POST, etc.)
// Build allowed origins from environment variables for flexible deployments.
// Set FRONTEND_URL to your production frontend (Vercel) URL, and optionally
// ADDITIONAL_FRONTEND_ORIGINS as a comma-separated list for preview URLs.
const envOrigins = [];
if (process.env.FRONTEND_URL) envOrigins.push(process.env.FRONTEND_URL);
if (process.env.ADDITIONAL_FRONTEND_ORIGINS) {
  envOrigins.push(...process.env.ADDITIONAL_FRONTEND_ORIGINS.split(',').map(s => s.trim()).filter(Boolean));
}

// Always allow requests from tools (no origin) and local dev by default
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

const allowedOrigins = [...new Set([...envOrigins, ...defaultOrigins])];

// Log allowed origins for debugging
console.log('✓ CORS Allowed Origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    // Check if origin is in whitelist
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all Vercel preview deployments
    // Matches: https://safespeakplus-*.vercel.app and https://*vercel.app
    if (origin && origin.includes('vercel.app')) {
      return callback(null, true);
    }

    // Allow localhost in development
    if (origin && origin.includes('localhost')) {
      return callback(null, true);
    }

    // For development: uncomment to allow all origins (NOT for production!)
    // return callback(null, true);

    console.warn(`✗ CORS Blocked: ${origin}`);
    callback(new Error('CORS policy: origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200 // For legacy browsers
}));

// JSON Parser Middleware
// Converts incoming JSON strings to JavaScript objects
// 
// WITHOUT THIS:
// req.body = undefined (even if frontend sends JSON)
// 
// WITH THIS:
// Frontend sends: '{"email":"test@college.edu"}'
// Express converts to: { email: 'test@college.edu' }
// Now we can use: req.body.email
app.use(express.json());

// URL Encoded Parser
// For form submissions (less common in APIs)
app.use(express.urlencoded({ extended: true }));

// ===================================
// STEP 5: Connect to Database
// ===================================

// Call connectDB function from config/db.js
// This connects Node.js to MongoDB
// If connection fails, process exits
connectDB();

// ===================================
// STEP 6: Setup API Routes
// ===================================

/**
 * ROUTE REGISTRATION
 * 
 * WHAT THIS DOES:
 * Tells Express where to find route handlers
 * 
 * SYNTAX: app.use(path, router)
 * - path: URL prefix (/api/auth)
 * - router: Import routes file
 * 
 * RESULT:
 * All routes in authRoutes will be prefixed with /api/auth
 * 
 * Example:
 * authRoutes has: router.post('/register', ...)
 * Final URL becomes: /api/auth/register
 */

// Authentication routes
app.use('/api/auth', authRoutes);

// Report routes
app.use('/api/reports', reportRoutes);

// Report authenticity routes
app.use('/api/reports', reportAuthenticityRoutes);

// Message routes
app.use('/api/messages', messageRoutes);

// User routes
app.use('/api/user', userRoutes);

// Story routes
app.use('/api/stories', storyRoutes);

// Notification routes
app.use('/api/notifications', notificationRoutes);

// Analytics routes
app.use('/api/analytics', analyticsRoutes);

// ===================================
// STEP 7: Health Check Route
// ===================================

/**
 * Simple route to verify server is running
 * 
 * USAGE:
 * Frontend can call GET /api/health
 * If server responds, server is up
 */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SafeSpeak-Plus Backend is Running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// ===================================
// STEP 8: 404 - Route Not Found
// ===================================

/**
 * This runs if no route matches
 * Should be last route
 */

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.path} not found`,
    method: req.method,
    availableRoutes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/anonymous-login',
      'GET /api/auth/me',
      'GET /api/health'
    ]
  });
});

// ===================================
// STEP 9: Error Handling Middleware
// ===================================

/**
 * ERROR HANDLING MIDDLEWARE
 * 
 * Catches errors from any route handler
 * Prevents server from crashing
 * Sends user-friendly error messages
 * 
 * HOW TO TRIGGER:
 * throw new Error('Something went wrong');
 * OR
 * next(error);
 * 
 * MIDDLEWARE SIGNATURE:
 * (err, req, res, next) - 4 parameters means error handler
 */

app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Extract error details
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ===================================
// STEP 10: Start Server
// ===================================

/**
 * WHAT DOES THIS DO?
 * 1. Gets port from .env or uses default 5000
 * 2. app.listen() starts server
 * 3. Server listens for incoming HTTP requests
 * 4. Callback runs when server starts
 */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║          SafeSpeak-Plus Backend Server Started           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  🚀 Server running at: http://localhost:${PORT}
║  📝 Environment: ${process.env.NODE_ENV || 'development'}
║  🔐 API Endpoints:                                      ║
║     - POST   /api/auth/register                         ║
║     - POST   /api/auth/login                            ║
║     - POST   /api/auth/anonymous-login                  ║
║     - GET    /api/auth/me (protected)                   ║
║     - GET    /api/health (health check)                 ║
║                                                           ║
║  📊 Database:                                           ║
║     - Connection: ${process.env.MONGODB_URI?.substring(0, 40)}...
║                                                           ║
║  ✅ Frontend URL: ${process.env.FRONTEND_URL}
║                                                           ║
║  💡 Tips:                                               ║
║     - Use Postman to test API                           ║
║     - Check network tab in DevTools                     ║
║     - Check console.log output below                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// ===================================
// STEP 11: Handle Unhandled Errors
// ===================================

/**
 * GRACEFUL ERROR HANDLING
 * 
 * If any error not caught, server crashes
 * These handlers prevent that
 */

// Unhandled Promise Rejection
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Uncaught Exception
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// ===================================
// COMPLETE REQUEST-RESPONSE FLOW
// ===================================

/**
 * EXAMPLE: User Registration
 * 
 * 1. FRONTEND (Browser)
 *    User fills form: email, password
 *    Clicks "Register" button
 *    JavaScript sends: fetch('http://localhost:5000/api/auth/register', {
 *      method: 'POST',
 *      headers: { 'Content-Type': 'application/json' },
 *      body: JSON.stringify({ email, password })
 *    })
 * 
 * 2. NETWORK
 *    HTTP Request travels from browser to backend
 * 
 * 3. SERVER (This file)
 *    Request arrives at Express
 *    CORS middleware: Checks if origin allowed ✓
 *    JSON middleware: Parses JSON body ✓
 *    Route matching: /api/auth matches ✓
 * 
 * 4. ROUTES (authRoutes.js)
 *    /api/auth/register matches ✓
 *    Calls authController.register()
 * 
 * 5. CONTROLLER (authController.js)
 *    Validates email, password
 *    Checks if email already exists
 *    Encrypts password with bcrypt
 *    Generates anonymous code
 *    Saves user to database
 * 
 * 6. DATABASE (MongoDB)
 *    User document saved
 * 
 * 7. RESPONSE
 *    Controller sends JSON response
 *    { success: true, user: { ... } }
 * 
 * 8. FRONTEND
 *    Receives response
 *    Displays success message
 *    Redirects to login page
 * 
 * COMPLETE ROUND TRIP:
 * Browser → Network → Server → Routes → Controller → Database
 * ↑                                                        ↓
 * ←←←←←←←←←←←←←←←←←←← Response ←←←←←←←←←←←←←←←←←←←
 */

/**
 * ===================================
 * QUICK REFERENCE
 * ===================================
 * 
 * Middleware Order (Important!):
 * 1. CORS - Allow frontend requests
 * 2. JSON Parser - Parse request body
 * 3. Routes - Handle requests
 * 4. 404 Handler - Not found
 * 5. Error Handler - Catch errors
 * 
 * Express Methods:
 * app.use() - Add middleware or mount router
 * app.get(path, handler) - GET requests
 * app.post(path, handler) - POST requests
 * app.listen(port, callback) - Start server
 * 
 * HTTP Status Codes:
 * 200 - Success (OK)
 * 201 - Success (Created)
 * 400 - Client error (Bad Request)
 * 401 - Unauthorized (wrong credentials)
 * 404 - Not Found
 * 500 - Server Error
 * 
 * Environment Variables:
 * process.env.PORT - Server port
 * process.env.NODE_ENV - development/production
 * process.env.MONGODB_URI - Database connection
 * process.env.JWT_SECRET - Token signing key
 * process.env.FRONTEND_URL - Frontend domain
 * 
 * Starting Server:
 * npm run dev    - Development (with auto-restart)
 * npm start      - Production
 * 
 * Testing:
 * curl -X POST http://localhost:5000/api/auth/register \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"test@college.edu","password":"Test123"}'
 */

export default app;
