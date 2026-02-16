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

/* =====================================
   Register User
   POST /api/auth/register
===================================== */
export const register = async (req, res) => {
  try {
    const { email, password, confirmPassword, gmailAddress, gmailPassword, fullName } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and confirm password'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
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
      password,
      fullName: fullName || null,
      isEmailVerified: false,
      gmailAddress,
      gmailPassword
    });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    newUser.verificationToken = verificationToken;
    newUser.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await newUser.save();

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const emailResult = await sendVerificationEmail(
      gmailAddress,
      gmailAddress,
      gmailPassword,
      verificationToken,
      baseUrl
    );

    if (!emailResult.success) {
      await User.deleteOne({ _id: newUser._id });
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please verify your email.',
      user: {
        id: newUser._id,
        email: newUser.email
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
