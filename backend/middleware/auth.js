/**
 * ===================================
 * JWT MIDDLEWARE (middleware/auth.js)
 * ===================================
 * 
 * PURPOSE:
 * Protects routes by verifying JWT tokens
 * Only authenticated users can access protected routes
 * 
 * ANALOGY:
 * Middleware = Security guard at club entrance
 * Token = VIP pass
 * Guard checks pass → if valid, let in
 * Guard denies entry → if invalid
 * 
 * WHEN IS THIS USED?
 * When user wants to access protected routes like /dashboard
 * 
 * FLOW:
 * Frontend has JWT token from login
 * → Frontend makes request with token in header
 * → This middleware checks token
 * → If valid: Continue to route handler
 * → If invalid: Return 401 Unauthorized
 */

import jwt from 'jsonwebtoken';

/**
 * MIDDLEWARE FUNCTION: authenticate
 * 
 * This is middleware - it runs BEFORE route handlers
 * 
 * Middleware signature: (req, res, next) => { }
 * - req: Request object (contains data from frontend)
 * - res: Response object (use to send data back)
 * - next: Function to call next middleware/route
 * 
 * If you DON'T call next(), the request stops here
 * If authentication fails, we send error response
 * If authentication succeeds, we call next() to proceed
 */
export const authenticate = (req, res, next) => {
  try {
    /**
     * STEP 1: Get token from request
     * 
     * Frontend sends token in Authorization header like:
     * Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     * 
     * Format breakdown:
     * Authorization header value = "Bearer <token>"
     * We need to extract just the token part (after "Bearer ")
     */
    
    // Get Authorization header
    const authHeader = req.headers.authorization;
    
    // Check if header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided. Please login first.'
      });
    }

    // Split "Bearer token" and get just the token
    // authHeader = "Bearer eyJhbGci..."
    // split(' ') → ["Bearer", "eyJhbGci..."]
    // [1] → "eyJhbGci..."
    const token = authHeader.split(' ')[1];

    // Check if token exists (format was correct)
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format. Use: Authorization: Bearer <token>'
      });
    }

    /**
     * STEP 2: Verify token signature
     * 
     * JWT tokens have 3 parts: Header.Payload.Signature
     * 
     * We need to verify:
     * 1. Token hasn't been modified
     * 2. Token hasn't expired
     * 3. Token was signed with correct secret
     * 
     * jwt.verify() does all this automatically
     * 
     * If verification fails, throws error
     * If verification succeeds, returns decoded payload
     */
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    /**
     * STEP 3: Attach user info to request
     * 
     * Now that we verified the token, we know the user is real
     * We attach user info to req.user so route handlers can use it
     * 
     * decoded contains:
     * {
     *   userId: "507f1f77bcf86cd799439011",
     *   email: "student@college.edu",
     *   iat: 1705344600,      // Issued at (timestamp)
     *   exp: 1706122200       // Expires at (timestamp)
     * }
     */
    
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      iat: decoded.iat,
      exp: decoded.exp
    };

    // Call next() to proceed to route handler
    // This means authentication passed!
    next();

  } catch (error) {
    /**
     * ERROR HANDLING
     * 
     * Different JWT errors:
     * - TokenExpiredError: Token's expiration time has passed
     * - JsonWebTokenError: Token is invalid/malformed
     * - NotBeforeError: Token not valid yet (rare)
     */

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
        error: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Token may have been tampered with.',
        error: 'INVALID_TOKEN'
      });
    }

    // Generic JWT error
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: ' + error.message,
      error: error.name
    });
  }
};

/**
 * ===================================
 * HOW JWT WORKS (Simple Explanation)
 * ===================================
 * 
 * SCENARIO: User wants to login and access dashboard
 * 
 * 1. USER LOGS IN:
 *    Frontend → /api/auth/login
 *    Sends: email, password
 *    Backend: Validates password, creates JWT token
 *    Response: { token: "eyJhbGci..." }
 * 
 * 2. FRONTEND STORES TOKEN:
 *    localStorage.setItem('token', token);
 * 
 * 3. USER ACCESSES PROTECTED PAGE (/dashboard):
 *    Frontend → /api/user/dashboard
 *    Includes: Authorization: Bearer eyJhbGci...
 *    Backend: This middleware runs
 *    Checks: Is token valid? Has it expired?
 *    If yes: Proceeds to route handler
 *    If no: Returns 401 error
 * 
 * JWT STRUCTURE:
 * ┌─ Header
 * │  {
 * │    "alg": "HS256",        // Algorithm (HMAC-SHA256)
 * │    "typ": "JWT"           // Type (JSON Web Token)
 * │  }
 * │
 * ├─ Payload
 * │  {
 * │    "userId": "123",       // User's database ID
 * │    "email": "user@email.com",
 * │    "iat": 1705344600,     // Issued at
 * │    "exp": 1706122200      // Expires at (7 days later)
 * │  }
 * │
 * └─ Signature
 *    HMACSHA256(
 *      base64(header) + "." + base64(payload),
 *      "SECRET_KEY"
 *    )
 * 
 * FINAL TOKEN: Header.Payload.Signature
 * 
 * WHY IS SIGNATURE IMPORTANT?
 * If someone changes the payload, signature becomes invalid
 * Only we know the SECRET_KEY, so only we can create valid tokens
 * Attacker can't create fake tokens
 * 
 * TOKEN VALIDATION:
 * 1. Verify signature (is it signed with our secret?)
 * 2. Check expiration (is token still valid time-wise?)
 * 3. Extract user info from payload
 * 4. Attach to request for route handler to use
 * 
 * SECURITY:
 * - Token is signed with SECRET_KEY (only server knows it)
 * - Attacker can read token (it's base64 encoded, not encrypted)
 * - Attacker can't modify token (signature would be invalid)
 * - Attacker can't create fake token (doesn't know SECRET_KEY)
 * - If stolen: Attacker can impersonate user until token expires
 * 
 * EXPIRATION:
 * - Tokens expire (default: 7 days in our setup)
 * - After expiration, user must login again
 * - Reduces damage if token is stolen
 * - Can implement refresh tokens for better UX
 */

/**
 * ===================================
 * USAGE IN ROUTES
 * ===================================
 * 
 * UNPROTECTED ROUTE (anyone can access):
 * router.post('/register', register);
 * 
 * PROTECTED ROUTE (only authenticated users):
 * router.get('/dashboard', authenticate, getDashboard);
 * 
 * ADMIN ONLY ROUTE (two middleware):
 * router.delete('/user/:id', authenticate, isAdmin, deleteUser);
 * 
 * FLOW FOR PROTECTED ROUTE:
 * Request → authenticate middleware
 *        ↓ (if token valid)
 *        → getDashboard route handler
 *        → Response sent
 *
 * OR
 *
 * Request → authenticate middleware
 *        ↓ (if token invalid)
 *        → Return 401 error (never reach route handler)
 */

export default authenticate;
