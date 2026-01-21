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
const allowedOrigins = [
  'https://safespeakplus.vercel.app', // production domain
  'https://safespeakplus-qm4svb1rl-zainabfathima-1691s-projects.vercel.app' // Vercel preview URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, mobile apps, etc.
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
