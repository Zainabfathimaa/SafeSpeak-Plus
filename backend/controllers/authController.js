import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendRegistrationEmailWithTimeout, sendAnonymousCodeEmailWithTimeout } from '../utils/emailService.js';

/* Generate JWT */
const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/* Register */
export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const newUser = new User({
      email: email.toLowerCase(),
      password,
      fullName: fullName || null,
      isEmailVerified: true // Automatically verified
    });

    // Generate Anonymous Code immediately upon registration
    newUser.anonymousCode = newUser.generateAnonymousCode();

    await newUser.save();

    // EXTREMELY IMPORTANT: Send the response FIRST. 
    // This prevents the "Infinite Load" on the frontend.
    res.status(201).json({
      success: true,
      message: 'Registration successful. Your Anonymous Code has been sent to your email.'
    });

    // Send the email in the background (Non-blocking)
    const targetEmail = email.toLowerCase().trim();
    console.log(`📡 Background task: Sending registration email to ${targetEmail}...`);
    
    // Using the timeout version for extra safety
    sendRegistrationEmailWithTimeout(
      targetEmail,
      newUser.anonymousCode,
      15000 // 15 second limit for background task
    ).then(result => {
      if (result && result.success) {
        console.log(`✅ Background email SUCCESS for ${targetEmail}`);
      } else {
        console.warn(`⚠️ Background email FAILURE/TIMEOUT for ${targetEmail}:`, result?.message);
      }
    }).catch(err => {
      console.error(`❌ Background email CRASH for ${targetEmail}:`, err);
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

/* Register Admin */
export const registerAdmin = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const newAdmin = new User({
      email: email.toLowerCase(),
      password,
      fullName: fullName || null,
      role: role || 'admin', // Default to admin if not specified
      isEmailVerified: true // Admins are automatically verified
    });

    // Admins don't get anonymous codes
    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Admin registration successful'
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ success: false, message: 'Admin registration failed' });
  }
};

/* Login */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // NEW PREFERENCE: Restrict email login to staff/admin only
    if (user.role === 'user') {
      return res.status(403).json({ success: false, message: 'Students must login using their Anonymous Code. Email login is restricted to Staff and Admins.' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.email, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

/* Anonymous Login */
export const anonymousLogin = async (req, res) => {
  try {
    const { anonymousCode } = req.body;

    const user = await User.findOne({
      anonymousCode: anonymousCode?.toUpperCase()
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid anonymous code' });
    }

    const token = generateToken(user._id, user.email, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};



/* Forgot Code */
export const forgotCode = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both your college email and your account password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Incorrect identity credentials.' });
    }

    // Verify ownership by checking the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect identity credentials.' });
    }

    // Regenerate and reset the Anonymous Code for security
    user.anonymousCode = user.generateAnonymousCode();
    await user.save();

    // EXTREMELY IMPORTANT: Send the response FIRST. 
    // This prevents the "Infinite Load" on the frontend.
    res.status(200).json({ 
      success: true, 
      message: 'Your identity was verified and a new anonymous code was sent to your email.' 
    });

    // Send the email in the background (Non-blocking)
    const targetEmail = user.email.toLowerCase().trim();
    console.log(`📡 Background task: Sending code reset email to ${targetEmail}...`);
    
    sendAnonymousCodeEmailWithTimeout(
      targetEmail,
      user.anonymousCode,
      15000 // 15 second limit
    ).then(result => {
      if (result && result.success) {
        console.log(`✅ Background reset email SUCCESS for ${targetEmail}`);
      } else {
        console.warn(`⚠️ Background reset email FAILURE/TIMEOUT for ${targetEmail}:`, result?.message);
      }
    }).catch(err => {
      console.error(`❌ Background reset email CRASH for ${targetEmail}:`, err);
    });

  } catch (error) {
    console.error('Forgot Code Error: ', error);
    res.status(500).json({ success: false, message: 'Failed to process forgot code request' });
  }
};

/* Get Current User */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user' });
  }
};

/* Change Password */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both old and new passwords' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.userId).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect old password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
};
