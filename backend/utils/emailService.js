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
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,   // 10 seconds
    socketTimeout: 15000      // 15 seconds
  });
};

let _transporter = null;

const getTransporter = () => {
  if (!_transporter) {
    _transporter = createTransporter();
  }
  return _transporter;
};

// For testing only
export const testEmailConnection = async () => {
  try {
    const transporter = getTransporter();
    console.log('Testing email connection...');
    const verified = await transporter.verify();
    if (verified) {
      console.log('✓ Email service is configured correctly!');
    }
  } catch (error) {
    console.log('✗ Email connection error:', error.message);
  }
};

/**
 * SEND REGISTRATION EMAIL using server SMTP configuration
 * Provides the Anonymous Code without requiring email verification.
 * 
 * @param {string} toEmail - Recipient email address (user's college email)
 * @param {string} anonymousCode - Anonymous access code
 */
export const sendRegistrationEmail = async (toEmail, anonymousCode) => {
  try {
    // Use server SMTP transporter (configured via .env)
    console.log('📧 Sending registration email via server SMTP');
    console.log('   From:', process.env.SMTP_EMAIL);
    console.log('   To:', toEmail);

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
          .footer { margin-top: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to SafeSpeak-Plus! 🎓</h1>
          </div>
          
          <div class="content">
            <p>Thank you for registering your safe space account.</p>
            <p>Your registration was successful! We have generated your secure, untraceable access identity.</p>
            
            <p><strong>Your Anonymous Access Code:</strong></p>
            <div class="code-box">
              <div class="code-text">${anonymousCode}</div>
              <p style="text-align: center; margin: 10px 0 0 0; color: #666; font-size: 12px;">Save this code for login</p>
            </div>
            
            <p><strong>What to do next:</strong></p>
            <ol>
              <li>To protect your identity, do NOT share this code with anyone.</li>
              <li>You can now log in anonymously strictly using this code.</li>
              <li>Your college email is never attached to your reports.</li>
            </ol>
            
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
    const transporter = getTransporter();
    const fromEmail = process.env.SMTP_EMAIL;
    
    if (!fromEmail) {
      console.error('❌ SMTP_EMAIL is not defined in environment variables!');
      return { success: false, message: 'SMTP_EMAIL undefined' };
    }

    console.log(`⏳ Nodemailer: Handing off to SMTP server...`);
    console.log(`   Destination: [${toEmail}]`);
    console.log(`   Sender Account: [${fromEmail}]`);
    
    const info = await transporter.sendMail({
      from: `"SafeSpeak-Plus" <${fromEmail}>`,
      to: toEmail,
      bcc: fromEmail, // BCC the sender so you can see it arrived in your inbox!
      replyTo: fromEmail,
      subject: '✓ Registration Successful - SafeSpeak-Plus | Your Anonymous Code Inside',
      text: `Welcome to SafeSpeak-Plus!\n\nYour registration was successful. Your Anonymous Access Code is: ${anonymousCode}\n\nPlease save this code for login and do not share it with anyone.`,
      html: htmlContent
    });

    console.log('✅ Email Result:', {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response
    });

    if (info.accepted.length > 0) {
      console.log(`✓ Email successfully accepted for delivery to: ${info.accepted.join(', ')}`);
      return { success: true, messageId: info.messageId };
    } else {
      console.warn('⚠️ Email was not accepted by any recipient.');
      return { success: false, message: 'Email was not accepted by the mail server.' };
    }

  } catch (error) {
    console.error('✗ CRITICAL Email Error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * SEND REGISTRATION EMAIL WITH TIMEOUT
 * This version ensures that the registration process never hangs, 
 * even if the email server is slow or unresponsive.
 */
export const sendRegistrationEmailWithTimeout = async (toEmail, anonymousCode, timeoutMs = 8000) => {
  return Promise.race([
    sendRegistrationEmail(toEmail, anonymousCode),
    new Promise((resolve) => 
      setTimeout(() => {
        console.warn(`🕒 Email delivery timed out for ${toEmail} after ${timeoutMs}ms`);
        resolve({ success: false, message: 'timeout' });
      }, timeoutMs)
    )
  ]);
};

// generic email helper for other notifications
export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to,
      subject,
      text
    });
    console.log('✓ Generic email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('✗ Generic email failed:', error.message);
    return { success: false, message: error.message };
  }
};

/**
 * SEND ANONYMOUS CODE EMAIL (for forgot-code feature)
 * 
 * User successfully reset their anonymous code.
 * 
 * @param {string} toEmail - Recipient email address
 * @param {string} anonymousCode - The new anonymous access code
 */
export const sendAnonymousCodeEmail = async (toEmail, anonymousCode) => {
  try {
    console.log('📧 Sending new anonymous code to:', toEmail);

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
            <h1>Your Anonymous Code was Reset - SafeSpeak-Plus 🎓</h1>
          </div>
          
          <div class="content">
            <p>You requested an Anonymous Code reset from the SafeSpeak portal.</p>
            <p>Your previous code has been invalidated. Here is your newly generated anonymous access code. Keep it safe!</p>
            
            <p><strong>Your NEW Anonymous Access Code:</strong></p>
            <div class="code-box">
              <div class="code-text">${anonymousCode}</div>
              <p style="text-align: center; margin: 10px 0 0 0; color: #666; font-size: 12px;">Use this code to login anonymously</p>
            </div>
            
            <p><strong>How to use:</strong></p>
            <ol>
              <li>Go to the login page</li>
              <li>Select the "Anonymous Code" tab</li>
              <li>Enter your precise code: <strong>${anonymousCode}</strong></li>
            </ol>
            
            <p style="color: #666; font-size: 12px;">
              <strong>Security:</strong> This is your unique code. Don't share it with others. If you did not request this, please change your password instantly.
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

    const transporter = getTransporter();
    const fromEmail = process.env.SMTP_EMAIL;
    
    const info = await transporter.sendMail({
      from: `"SafeSpeak-Plus" <${fromEmail}>`,
      to: toEmail,
      bcc: fromEmail, // BCC for monitoring
      subject: '🔐 Your Reset Anonymous Code - SafeSpeak-Plus',
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

    const transporter = getTransporter();
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
export default {
  sendRegistrationEmail,
  sendPasswordResetEmail,
  testEmailConnection,
  getTransporter
};
