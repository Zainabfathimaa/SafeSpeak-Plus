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
app.use(express.json({ limit: '50mb' }));

// URL Encoded Parser
// For form submissions (less common in APIs)
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ===================================
// START SERVER
// ===================================

async function startServer() {
  try {
    // Call connectDB function from config/db.js
    // This connects Node.js to MongoDB
    // If connection fails, process exits
    await connectDB();

    // ===================================
    // STEP 6: Setup API Routes
    // ===================================

    /**
     * ROUTE REGISTRATION
     *
     * WHAT THIS DOES:
     * Tells Express where to find route handlers
     */

    // Auth routes
    app.use('/api/auth', authRoutes);

    // User routes
    app.use('/api/users', userRoutes);

    // Message routes
    app.use('/api/messages', messageRoutes);

    // Notification routes
    app.use('/api/notifications', notificationRoutes);

    // Report routes
    app.use('/api/reports', reportRoutes);

    // Report Authenticity routes
    app.use('/api/report-authenticity', reportAuthenticityRoutes);

    // Story routes
    app.use('/api/stories', storyRoutes);

    // Analytics routes
    app.use('/api/analytics', analyticsRoutes);

    // ===================================
    // STEP 7: Health Check Route
    // ===================================

    /**
     * HEALTH CHECK ENDPOINT
     *
     * Simple endpoint to check if server is running
     * Useful for:
     * - Load balancers
     * - Monitoring tools
     * - Deployment checks
     */
    app.get('/api/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'SafeSpeak-Plus Backend is Running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // ===================================
    // STEP 8: 404 Handler (Not Found)
    // ===================================

    /**
     * 404 HANDLER
     *
     * If no route matches the request, this runs
     * Returns JSON error instead of HTML page
     */
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        method: req.method,
        availableRoutes: [
          'POST /api/auth/register',
          'POST /api/auth/register-admin',
          'POST /api/auth/login',
          'POST /api/auth/anonymous-login',
          'GET /api/auth/me',
          'GET /api/health'
        ]
      });
    });

    // ===================================
    // STEP 9: Global Error Handler
    // ===================================

    /**
     * GLOBAL ERROR HANDLER
     *
     * Catches any errors that occur in routes
     * Prevents server from crashing
     * Returns consistent error format
     */
    app.use((error, req, res, next) => {
      console.error('Global Error Handler:', error);

      // Mongoose validation error
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: messages
        });
      }

      // Mongoose duplicate key error
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
          success: false,
          message: `Duplicate ${field} error`,
          field: field
        });
      }

      // JWT errors
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }

      // Default error
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
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
║     - POST   /api/auth/register-admin                   ║
║     - POST   /api/auth/login                            ║
║     - POST   /api/auth/anonymous-login                  ║
║     - GET    /api/auth/me (protected)                   ║
║     - GET    /api/health (health check)                 ║
║                                                           ║
║  📊 Database:                                           ║
║     - Connection: mongodb+srv://zainab-fathima:%40Zainabf0...
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

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();

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

export default app;
