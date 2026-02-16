import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/emailService.js';

/* =====================================
   Utility: Generate JWT Token
===================================== */
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
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
/**
 * ===================================
 * CONTROLLER FUNCTION 6: Forgot Code
 * ===================================
 * 
 * Route: POST /api/auth/forgot-code
 * 
 * User forgot their anonymous code?
 * Send it to their registered email again
 */
export const forgotCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address'
      });
    }
export const register = async (req, res) => {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
  try {
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email not registered. Please register first.'
      });
    }
    // Step 1: Extract data from request body
    if (!user.anonymousCode) {
      return res.status(400).json({
        success: false,
        message: 'No anonymous code found for this account'
      });
    }
    // req.body contains JSON sent by frontend
    // Send anonymous code via email
    const emailResult = await sendVerificationEmail(
      email,
      null, // no verification token needed
      user.anonymousCode,
      process.env.FRONTEND_URL || 'http://localhost:5173'
    );

    // Actually use the new sendAnonymousCodeEmail function instead
    const { sendAnonymousCodeEmail } = await import('../utils/emailService.js');
    const codeEmailResult = await sendAnonymousCodeEmail(
      email,
      user.anonymousCode,
      process.env.FRONTEND_URL || 'http://localhost:5173'
    );
    const { email, password } = req.body;
    if (!codeEmailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send anonymous code. Please try again.'
      });
    }

    console.log('✓ Anonymous code resent to:', email);
    // ===================================
    res.status(200).json({
      success: true,
      message: 'Your anonymous code has been sent to your email'
    });
    // VALIDATION: Check required fields
  } catch (error) {
    console.error('Forgot code error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again.'
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
    // ===================================
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    if (!email.toLowerCase().endsWith('@cmr.edu.in')) {
      return res.status(400).json({
        success: false,
        message: 'You must register with your college email (@cmr.edu.in)'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const newUser = new User({
      email: email.toLowerCase(),
      password: password,
      fullName: req.body.fullName || null,
      isEmailVerified: false,  // Not verified until email link clicked
      anonymousCode: anonymousCode,  // Store anonymous code
      // Do not store user Gmail credentials. Server will send verification email.
    });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    newUser.verificationToken = verificationToken;
    newUser.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await newUser.save();

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const emailResult = await sendVerificationEmail(
      email, // Send to user's college email using server SMTP
      verificationToken,
      baseUrl
    );

    if (!emailResult.success) {
      await User.deleteOne({ _id: newUser._id });
      return res.status(500).json({
        success: false,
        message: emailResult.message || 'Failed to send verification email.'
      });
    }

    console.log('✓ User registered successfully:', email);
    console.log('✓ Anonymous Code:', anonymousCode);
    console.log('✓ Verification email sent to:', email);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please verify your email.',
      user: {
        id: newUser._id,
        email: newUser.email,
        anonymousCode: anonymousCode
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

/* =====================================
   Login (Email + Password)
   POST /api/auth/login
===================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id, user.email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
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
      message: 'Login failed'
    });
  }
};

/* =====================================
   Anonymous Login
   POST /api/auth/anonymous-login
===================================== */
export const anonymousLogin = async (req, res) => {
  try {
    const { anonymousCode } = req.body;

    if (!anonymousCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide anonymous code'
      });
    }

    const user = await User.findOne({
      anonymousCode: anonymousCode.toUpperCase()
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid anonymous code'
      });
    }

    const token = generateToken(user._id, user.email);

    res.status(200).json({
      success: true,
      message: 'Anonymous login successful',
      token,
      user: {
        id: user._id
      }
    });

  } catch (error) {
    console.error('Anonymous login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

/* =====================================
   Verify Email
   POST /api/auth/verify-email
===================================== */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token required'
      });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }
    }).select('+verificationToken +verificationTokenExpiry');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    user.isEmailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed'
    });
  }
};

/* =====================================
   Get Current User
   GET /api/auth/me
===================================== */
export const getCurrentUser = async (req, res) => {
  try {
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
      message: 'Error fetching user'
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
  getCurrentUser,
  forgotCode
};
