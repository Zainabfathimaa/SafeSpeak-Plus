/**
 * ===================================
 * AUTHENTICATION CONTROLLER (controllers/authController.js)
 * ===================================
 * 
 * PURPOSE:
 * Contains all the logic for:
 * - User registration
 * - User login
 * - Anonymous login
 * 
 * ANALOGY:
 * Routes = URLs (REST endpoints)
 * Controllers = Actions those URLs trigger
 * 
 * Routes file: "If user goes to /register, run this controller function"
 * Controller file: "This is what to do when user registers"
 * 
 * WHY SEPARATE?
 * - Routes stay simple (just define endpoints)
 * - Controllers have complex business logic
 * - Easy to test and reuse logic
 * - Organized and scalable
 */

import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/emailService.js';

/**
 * UTILITY FUNCTION: Generate JWT Token
 * 
 * Creates a JWT token for authenticated users
 * 
 * WHAT DOES IT DO?
 * Takes user info → creates signed token → returns token
 * 
 * TOKEN PAYLOAD (what data is stored in token):
 * - userId: User's database ID
 * - email: User's email
 * - iat: When token was created
 * - exp: When token expires
 * 
 * SECURITY:
 * - Token is signed with JWT_SECRET from .env
 * - Only server knows the secret
 * - If someone modifies token, signature breaks
 */
const generateToken = (userId, email) => {
  // jwt.sign(payload, secret, options)
  // payload = data to encode in token
  // secret = key to sign token (from .env)
  // options = expiration, algorithm, etc.
  
  return jwt.sign(
    {
      userId: userId,           // User's MongoDB ID
      email: email              // User's email
    },
    process.env.JWT_SECRET,     // Secret key from .env (never share!)
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'  // Token valid for 7 days
    }
  );
};

/**
 * ===================================
 * CONTROLLER FUNCTION 1: Register User
 * ===================================
 * 
 * Route: POST /api/auth/register
 * 
 * WHAT HAPPENS:
 * 1. User submits: email, password
 * 2. Check if email already registered
 * 3. Check password is strong enough
 * 4. Create user in database
 * 5. Generate anonymous code
 * 6. Return success response
 * 
 * SECURITY CHECKS:
 * - Email format validation
 * - Password minimum length
 * - Email uniqueness
 * - Password encryption (done in model)
 * 
 * FRONTEND SENDS:
 * POST /api/auth/register
 * {
 *   "email": "student@college.edu",
 *   "password": "SecurePassword123"
 * }
 * 
 * BACKEND RESPONDS:
 * Success (201):
 * {
 *   "success": true,
 *   "message": "Registration successful",
 *   "user": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "email": "student@college.edu",
 *     "anonymousCode": "A7X-992-B4Q"
 *   }
 * }
 * 
 * Error (400):
 * {
 *   "success": false,
 *   "message": "Email already registered"
 * }
 */
export const register = async (req, res) => {
  try {
    // Step 1: Extract data from request body
    // req.body contains JSON sent by frontend
    const { email, password, confirmPassword, gmailAddress, gmailPassword } = req.body;

    // ===================================
    // VALIDATION: Check required fields
    // ===================================
    
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and confirm password'
      });
    }

    if (!gmailAddress || !gmailPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Gmail address and app password'
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // ===================================
    // VALIDATION: Email must be from college domain
    // ===================================
    
    if (!email.toLowerCase().endsWith('@cmr.edu.in')) {
      return res.status(400).json({
        success: false,
        message: 'You must register with your college email (@cmr.edu.in)'
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // ===================================
    // CHECK: Email already exists?
    // ===================================
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      // Email already registered
      return res.status(400).json({
        success: false,
        message: 'Email is already registered. Please login instead.'
      });
    }

    // ===================================
    // CREATE: New user (WITHOUT anonymous code yet)
    // ===================================
    
    // Generate anonymous code (like: A7X-992-B4Q)
    const generateAnonymousCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (i < 2) code += '-';
      }
      return code;
    };

    const anonymousCode = generateAnonymousCode();

    // Create new user object (but don't save yet)
    const newUser = new User({
      email: email.toLowerCase(),
      password: password,
      fullName: req.body.fullName || null,
      isEmailVerified: false,  // Not verified until email link clicked
      anonymousCode: anonymousCode,  // Store anonymous code
      gmailAddress: gmailAddress,  // Store user's Gmail
      gmailPassword: gmailPassword  // Store user's Gmail app password
    });

    // Generate verification token (random string)
    // User will receive this in email link
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Set token and expiry (24 hours from now)
    newUser.verificationToken = verificationToken;
    newUser.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Save user to database
    // This triggers the pre-save hook that encrypts password
    await newUser.save();

    // ===================================
    // SEND: Verification email with anonymous code using user's Gmail
    // ===================================
    
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const emailResult = await sendVerificationEmail(
      gmailAddress,  // Send to user's Gmail
      gmailAddress,  // From user's Gmail
      gmailPassword, // With user's Gmail app password
      verificationToken,
      anonymousCode,
      baseUrl
    );

    if (!emailResult.success) {
      // Email failed to send - delete the user we just created
      await User.deleteOne({ _id: newUser._id });
      
      return res.status(500).json({
        success: false,
        message: emailResult.message || 'Failed to send verification email. Please check your Gmail credentials.'
      });
    }

    console.log('✓ User registered successfully:', email);
    console.log('✓ Anonymous Code:', anonymousCode);
    console.log('✓ Verification email sent to:', gmailAddress);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account and receive your anonymous access code.',
      user: {
        id: newUser._id,
        email: newUser.email
      }
    });

  } catch (error) {
    // Handle unexpected errors
    console.error('Register error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: error.message
    });
  }
};

/**
 * ===================================
 * CONTROLLER FUNCTION 2: Login with Email & Password
 * ===================================
 * 
 * Route: POST /api/auth/login
 * 
 * WHAT HAPPENS:
 * 1. User submits: email, password
 * 2. Find user by email
 * 3. Compare password with stored encrypted password
 * 4. If match, create JWT token
 * 5. Return token to frontend
 * 
 * LOGIN FLOW:
 * 1. Frontend sends email + password
 * 2. Backend finds user
 * 3. Backend compares passwords using bcrypt
 * 4. Bcrypt doesn't decrypt stored password
 * 5. Instead, encrypts submitted password and compares
 * 6. If match, passwords are correct
 * 7. Create JWT token
 * 8. Send token to frontend
 * 9. Frontend stores token in localStorage
 * 10. Token sent with every future request
 * 
 * FRONTEND SENDS:
 * POST /api/auth/login
 * {
 *   "email": "student@college.edu",
 *   "password": "SecurePassword123"
 * }
 * 
 * BACKEND RESPONDS:
 * Success (200):
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "email": "student@college.edu"
 *   }
 * }
 * 
 * Error (401):
 * {
 *   "success": false,
 *   "message": "Invalid email or password"
 * }
 */
export const login = async (req, res) => {
  try {
    // Step 1: Extract credentials from request
    const { email, password } = req.body;

    // ===================================
    // VALIDATION: Check required fields
    // ===================================
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // ===================================
    // FIND: User in database
    // ===================================
    
    // Use select('+password') because password field has select: false
    // This means password isn't returned by default in queries
    // But for login, we need it to compare
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      // User not found
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // ===================================
    // COMPARE: Passwords using bcrypt
    // ===================================
    
    // user.comparePassword() is a method we defined in User model
    // It takes plain password and compares with encrypted password
    // Returns true if match, false if don't match
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      // Password doesn't match
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // ===================================
    // AUTHENTICATE: Create token
    // ===================================
    
    // Passwords match! User is authenticated
    // Create JWT token for this user
    const token = generateToken(user._id, user.email);

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // ===================================
    // RESPONSE: Send token
    // ===================================
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,  // Frontend will store this
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: error.message
    });
  }
};

/**
 * ===================================
 * CONTROLLER FUNCTION 3: Anonymous Login
 * ===================================
 * 
 * Route: POST /api/auth/anonymous-login
 * 
 * WHAT HAPPENS:
 * 1. User submits: anonymousCode (e.g., A7X-992-B4Q)
 * 2. Find user with that code
 * 3. Create JWT token
 * 4. Return token
 * 
 * WHY ANONYMOUS LOGIN?
 * - Users don't want to remember password
 * - They got a special code when they registered
 * - Code is random and unique
 * - Only they have the code
 * - Using code is like using a password
 * 
 * FRONTEND SENDS:
 * POST /api/auth/anonymous-login
 * {
 *   "anonymousCode": "A7X-992-B4Q"
 * }
 * 
 * BACKEND RESPONDS:
 * Success (200):
 * {
 *   "success": true,
 *   "message": "Anonymous login successful",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": "507f1f77bcf86cd799439011"
 *   }
 * }
 * 
 * Error (401):
 * {
 *   "success": false,
 *   "message": "Invalid anonymous code"
 * }
 */
export const anonymousLogin = async (req, res) => {
  try {
    // Step 1: Extract code from request
    const { anonymousCode } = req.body;

    // ===================================
    // VALIDATION: Check code provided
    // ===================================
    
    if (!anonymousCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide anonymous code'
      });
    }

    // ===================================
    // FIND: User with code
    // ===================================
    
    // Find user by anonymous code
    const user = await User.findOne({ 
      anonymousCode: anonymousCode.toUpperCase() 
    });

    if (!user) {
      // Code not found
      return res.status(401).json({
        success: false,
        message: 'Invalid anonymous code'
      });
    }

    // ===================================
    // AUTHENTICATE: Create token
    // ===================================
    
    // Code is valid, create token
    const token = generateToken(user._id, user.email);

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // ===================================
    // RESPONSE: Send token
    // ===================================
    
    res.status(200).json({
      success: true,
      message: 'Anonymous login successful',
      token: token,
      user: {
        id: user._id
        // Note: Not returning email to maintain anonymity
      }
    });

  } catch (error) {
    console.error('Anonymous login error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: error.message
    });
  }
};

/**
 * ===================================
 * OPTIONAL: Get current user info
 * ===================================
 * 
 * Route: GET /api/auth/me (protected route)
 * 
 * Frontend has token, wants to know who they are
 * This route returns user info based on token
 */
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by authenticate middleware
    // It contains userId and email from JWT token
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user info',
      error: error.message
    });
  }
};

/**
 * ===================================
 * QUICK REFERENCE
 * ===================================
 * 
 * Registration Process:
 * 1. Frontend sends email + password
 * 2. Backend validates inputs
 * 3. Backend checks email not in use
 * 4. Backend creates user with encrypted password
 * 5. Backend generates anonymous code
 * 6. Backend returns success + anonymous code
 * 7. Frontend shows code to user
 * 8. User saves code somewhere safe
 * 
 * Email & Password Login:
 * 1. Frontend sends email + password
 * 2. Backend finds user by email
 * 3. Backend compares password with bcrypt
 * 4. Backend creates JWT token
 * 5. Backend returns token
 * 6. Frontend stores token in localStorage
 * 
 * Anonymous Login:
 * 1. Frontend sends anonymous code
 * 2. Backend finds user with that code
 * 3. Backend creates JWT token
 * 4. Backend returns token
 * 5. Frontend stores token
 * 
 * Token Usage:
 * Every protected route check:
 * Authorization: Bearer <token>
 * Middleware verifies token
 * If valid: proceed to route handler
 * If invalid: return 401 error
 * 
/**
 * ===================================
 * CONTROLLER FUNCTION 4: Verify Email
 * ===================================
 * 
 * Route: POST /api/auth/verify-email
 * 
 * WHAT HAPPENS:
 * 1. Frontend sends verification token (from email link)
 * 2. Find user with matching token
 * 3. Check if token is still valid (not expired)
 * 4. Mark user as email verified
 * 5. Generate anonymous code
 * 6. Return code to user
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
 *   "message": "Email verified successfully",
 *   "anonymousCode": "ABC-123-DEF"
 * }
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // ===================================
    // FIND: User with matching token
    // ===================================
    
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }  // Token not expired
    }).select('+verificationToken +verificationTokenExpiry');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token. Please register again.'
      });
    }

    // ===================================
    // UPDATE: Mark email as verified
    // ===================================
    
    user.isEmailVerified = true;
    user.verificationToken = null;  // Clear token after use
    user.verificationTokenExpiry = null;

    // Generate unique anonymous code NOW (only after email verified)
    let anonymousCode;
    let isUnique = false;
    
    while (!isUnique) {
      anonymousCode = user.generateAnonymousCode();
      const existingCode = await User.findOne({ anonymousCode });
      if (!existingCode) {
        isUnique = true;
      }
    }

    user.anonymousCode = anonymousCode;

    // Save updated user
    await user.save();

    // ===================================
    // RESPONSE: Return anonymous code
    // ===================================
    
    res.status(200).json({
      success: true,
      message: 'Email verified successfully! Your anonymous access code:',
      anonymousCode: user.anonymousCode,
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Email verification failed. Please try again.'
    });
  }
};

/**
 * Error Codes:
 * 200: Success (OK)
 * 201: Success (Created - for registration)
 * 400: Bad Request (client error)
 * 401: Unauthorized (invalid credentials/token)
 * 404: Not Found
 * 500: Server Error
 */

export default {
  register,
  login,
  anonymousLogin,
  verifyEmail,
  getCurrentUser
};
