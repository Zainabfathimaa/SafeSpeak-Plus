/**
 * ===================================
 * EMAIL SERVICE (utils/emailService.js)
 * ===================================
 * 
 * PURPOSE:
 * Handles sending emails from your application
 * Currently used for: Email verification
 * 
 * HOW IT WORKS:
 * 1. Takes email, subject, HTML content
 * 2. Uses nodemailer to send via SMTP
 * 3. Returns success/error
 * 
 * REQUIRES:
 * - nodemailer (npm install nodemailer)
 * - Environment variables in .env:
 *   - SMTP_SERVICE: gmail, outlook, etc.
 *   - SMTP_EMAIL: sender email
 *   - SMTP_PASSWORD: sender password or app password
 */

import nodemailer from 'nodemailer';

/**
 * CREATE TRANSPORTER
 * This connects to your email service
 * Uses SMTP configuration from .env - works with any provider
 * 
 * ENVIRONMENT VARIABLES (all optional with defaults):
 * - SMTP_HOST: SMTP server (default: smtp.gmail.com)
 * - SMTP_PORT: SMTP port (default: 587)
 * - SMTP_SECURE: 'true' for SSL/465, 'false' for TLS/587 (default: false)
 * - SMTP_EMAIL: Sender email address
 * - SMTP_PASSWORD: Sender password or app password
 * 
 * EXAMPLES:
 * Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, SMTP_SECURE=false
 * Office365: SMTP_HOST=smtp.office365.com, SMTP_PORT=587, SMTP_SECURE=false
 * SendGrid: SMTP_HOST=smtp.sendgrid.net, SMTP_PORT=587, SMTP_SECURE=false
 */

const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const secure = process.env.SMTP_SECURE === 'true';
  
  console.log(`📧 SMTP Transporter: ${host}:${port} (secure: ${secure})`);
  
  return nodemailer.createTransport({
    host: host,
    port: port,
    secure: secure,
    auth: {
      user: process.env.SMTP_EMAIL || '',
      pass: process.env.SMTP_PASSWORD || ''
    }
  });
};

const transporter = createTransporter();

/**
 * SEND VERIFICATION EMAIL using server SMTP configuration
 * 
 * @param {string} toEmail - Recipient email address (user's college email)
 * @param {string} verificationToken - Token for verification link
 * @param {string} anonymousCode - Anonymous access code
 * @param {string} baseUrl - Base URL of your app
 */
export const sendVerificationEmail = async (toEmail, verificationToken, anonymousCode, baseUrl) => {
  try {
    // Use server SMTP transporter (configured via .env)
    console.log('📧 Sending verification email via server SMTP');
    console.log('   From:', process.env.SMTP_EMAIL);
    console.log('   To:', toEmail);

    // CREATE VERIFICATION LINK
    const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;

    // CREATE EMAIL CONTENT (HTML)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; }
          .content { margin: 20px 0; padding: 20px; border: 1px solid #eee; border-radius: 5px; }
          .code-box { background: #f0f0f0; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
          .code-text { font-size: 24px; font-weight: bold; color: #667eea; text-align: center; letter-spacing: 2px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to SafeSpeak-Plus! 🎓</h1>
          </div>
          
          <div class="content">
            <p>Thank you for registering with your college email!</p>
            
            <p>Please verify your email address by clicking the button below.</p>
            
            <p style="text-align: center;">
              <a href="${verificationLink}" class="button">Verify Email Address</a>
            </p>
            
            <p><strong>Your Anonymous Access Code:</strong></p>
            <div class="code-box">
              <div class="code-text">${anonymousCode}</div>
              <p style="text-align: center; margin: 10px 0 0 0; color: #666; font-size: 12px;">Save this code for login</p>
            </div>
            
            <p><strong>What to do next:</strong></p>
            <ol>
              <li>Click the button above to verify your email</li>
              <li>Save your anonymous access code: <strong>${anonymousCode}</strong></li>
              <li>You can now login anonymously using this code</li>
            </ol>
            
            <p style="color: #666; font-size: 12px;">
              <strong>Note:</strong> This link expires in 24 hours for security reasons.
            </p>
          </div>
          
          <div class="footer">
            <p>SafeSpeak-Plus Team</p>
            <p>Anonymous Incident Reporting System</p>
            <p>If you didn't register for this account, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // SEND EMAIL using server transporter
    const info = await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: toEmail,
      subject: '✓ Email Verification - SafeSpeak-Plus | Your Anonymous Code Inside',
      html: htmlContent
    });

    console.log('✓ Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('✗ Email sending failed:', error.message);
    
    // Return specific error message
    return { 
      success: false, 
      message: error.message.includes('Invalid login') 
        ? 'Invalid Gmail credentials. Please check your Gmail app password.'
        : 'Failed to send email. ' + error.message
    };
  }
};

/**
 * SEND ANONYMOUS CODE EMAIL (for forgot-code feature)
 * 
 * User forgot their anonymous code, so we resend it
 * 
 * @param {string} toEmail - Recipient email address
 * @param {string} anonymousCode - The anonymous access code
 * @param {string} baseUrl - Base URL of your app
 */
export const sendAnonymousCodeEmail = async (toEmail, anonymousCode, baseUrl) => {
  try {
    console.log('📧 Sending anonymous code to:', toEmail);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; }
          .content { margin: 20px 0; padding: 20px; border: 1px solid #eee; border-radius: 5px; }
          .code-box { background: #f0f0f0; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
          .code-text { font-size: 24px; font-weight: bold; color: #667eea; text-align: center; letter-spacing: 2px; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Anonymous Code - SafeSpeak-Plus 🎓</h1>
          </div>
          
          <div class="content">
            <p>Here's your anonymous access code. Keep it safe!</p>
            
            <p><strong>Your Anonymous Access Code:</strong></p>
            <div class="code-box">
              <div class="code-text">${anonymousCode}</div>
              <p style="text-align: center; margin: 10px 0 0 0; color: #666; font-size: 12px;">Use this code to login anonymously</p>
            </div>
            
            <p><strong>How to use:</strong></p>
            <ol>
              <li>Go to the login page</li>
              <li>Select "Anonymous Login"</li>
              <li>Enter your code: <strong>${anonymousCode}</strong></li>
              <li>You're logged in anonymously!</li>
            </ol>
            
            <p style="color: #666; font-size: 12px;">
              <strong>Security:</strong> This is your unique code. Don't share it with others.
            </p>
          </div>
          
          <div class="footer">
            <p>SafeSpeak-Plus Team</p>
            <p>Anonymous Incident Reporting System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: toEmail,
      subject: '🔐 Your Anonymous Code - SafeSpeak-Plus',
      html: htmlContent
    });

    console.log('✓ Anonymous code email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('✗ Failed to send anonymous code email:', error.message);
    return { success: false, message: 'Failed to send anonymous code email. ' + error.message };
  }
};

/**
 * SEND PASSWORD RESET EMAIL (for future use)
 * 
 * @param {string} email - Recipient email
 * @param {string} resetToken - Token for password reset
 * @param {string} baseUrl - Base URL of your app
 */
export const sendPasswordResetEmail = async (email, resetToken, baseUrl) => {
  try {
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetLink}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>Or copy this link: ${resetLink}</p>
        <p style="color: #666; font-size: 12px;">This link expires in 1 hour.</p>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Password Reset - SafeSpeak-Plus',
      html: htmlContent
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.log('✗ Password reset email failed:', error.message);
    return { success: false, message: 'Failed to send reset email' };
  }
};

/**
 * TEST EMAIL SENDING
 * Use this to verify your email config works
 * 
 * EXAMPLE:
 * node -e "import('./utils/emailService.js').then(m => m.testEmailConnection())"
 */
export const testEmailConnection = async () => {
  try {
    console.log('Testing email connection...');
    
    // Verify SMTP connection
    const verified = await transporter.verify();
    
    if (verified) {
      console.log('✓ Email service is configured correctly!');
      console.log(`  From: ${process.env.SMTP_EMAIL}`);
      console.log(`  Service: ${process.env.SMTP_SERVICE}`);
    } else {
      console.log('✗ Email service verification failed');
    }
  } catch (error) {
    console.log('✗ Email connection error:', error.message);
    console.log('  Make sure these are set in .env:');
    console.log('  - SMTP_SERVICE (gmail, outlook, etc)');
    console.log('  - SMTP_EMAIL (your email)');
    console.log('  - SMTP_PASSWORD (app password for Gmail)');
  }
};

export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
  testEmailConnection
};
