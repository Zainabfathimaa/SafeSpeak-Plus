import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/emailService.js';

/* ================================
   Generate JWT
================================ */
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/* ================================
   Register
================================ */
export const register = async (req, res) => {
  try {
    const { email, password, confirmPassword, fullName } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

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
      isEmailVerified: false
    });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    newUser.verificationToken = verificationToken;
    newUser.verificationTokenExpiry =
      new Date(Date.now() + 24 * 60 * 60 * 1000);

    await newUser.save();

    await sendVerificationEmail(
      email,
      verificationToken,
      process.env.FRONTEND_URL
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.'
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

/* ================================
   Login
================================ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id, user.email);

    res.status(200).json({
      success: true,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

/* ================================
   Anonymous Login
================================ */
export const anonymousLogin = async (req, res) => {
  try {
    const { anonymousCode } = req.body;

    const user = await User.findOne({
      anonymousCode: anonymousCode?.toUpperCase()
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
      token
    });

  } catch (error) {
    console.error('Anonymous login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

/* ================================
   Verify Email
================================ */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }
    });

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

/* ================================
   Get Current User
================================ */
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
      user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
};

