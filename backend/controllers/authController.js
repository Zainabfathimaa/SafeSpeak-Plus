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

/* Forgot Password — Send OTP to email */
export const forgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Please provide your registered email' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'No account found with that email' });

    // Generate a 6-digit OTP and store it with 10-minute expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.passwordResetOtp = otp;
    user.passwordResetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send OTP email (non-blocking)
    res.status(200).json({ success: true, message: 'A 6-digit OTP has been sent to your registered email' });

    const { sendEmail } = await import('../utils/emailService.js');
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#6366f1;">SafeSpeak+ — Password Reset OTP</h2>
        <p>You requested a password reset. Use the code below (valid for <strong>10 minutes</strong>):</p>
        <div style="background:#f0f0f0;padding:20px;text-align:center;border-radius:12px;margin:20px 0;">
          <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#6366f1;">${otp}</span>
        </div>
        <p style="color:#888;font-size:12px;">If you did not request this, ignore this email.</p>
        <p>— SafeSpeak+ Team</p>
      </div>`;

    sendEmail(user.email, '🔐 Password Reset OTP — SafeSpeak+', otp)
      .catch(err => console.error('OTP email send error:', err));

  } catch (error) {
    console.error('Forgot password OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

/* Reset Password with OTP */
export const resetPasswordOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email, OTP, and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.passwordResetOtp || user.passwordResetOtp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please request a new one.' });
    }

    if (!user.passwordResetOtpExpiry || new Date() > new Date(user.passwordResetOtpExpiry)) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    user.password = newPassword;
    user.passwordResetOtp = undefined;
    user.passwordResetOtpExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully. Please log in with your new password.' });

  } catch (error) {
    console.error('Reset password OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};
