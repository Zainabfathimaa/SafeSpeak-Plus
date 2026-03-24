import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendRegistrationEmail } from '../utils/emailService.js';

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

    // Send the email (awaiting it ensures it finishes before the response, which is more reliable)
    const targetEmail = email.toLowerCase().trim();
    console.log(`📧 DEBUG: authController is calling sendRegistrationEmail for: "${targetEmail}"`);
    
    try {
      const emailResult = await sendRegistrationEmail(
        targetEmail,
        newUser.anonymousCode
      );
      console.log('✅ Registration email response:', emailResult);
    } catch (emailErr) {
      console.error('⚠️ Registration email failed during registration:', emailErr);
      // We don't fail the whole registration if just the email fails
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for your anonymous code.'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

/* Login */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    // Send the email with the new code
    const { sendAnonymousCodeEmail } = await import('../utils/emailService.js');
    await sendAnonymousCodeEmail(user.email, user.anonymousCode);

    res.status(200).json({ success: true, message: 'Your identity was verified and a new anonymous code was sent to your email.' });

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
