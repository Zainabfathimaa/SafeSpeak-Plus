# Email Verification Feature - Testing Guide

## Overview
The email verification feature is now **FULLY IMPLEMENTED** on both backend and frontend. This guide will help you test the complete flow.

---

## Step 1: Configure Email Settings (.env)

### For Gmail Users:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" (if not already enabled)
3. Create an "App Password":
   - Go to "App Passwords"
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
4. Update `.env` in backend folder:
```
SMTP_SERVICE=gmail
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
```

### For Outlook/Microsoft Users:
```
SMTP_SERVICE=outlook
SMTP_EMAIL=your-email@outlook.com
SMTP_PASSWORD=your-password
```

### For Other Email Providers (Gmail alternatives):
```
SMTP_SERVICE=smtp.provider.com
SMTP_HOST=smtp.provider.com
SMTP_PORT=587
SMTP_EMAIL=your-email@provider.com
SMTP_PASSWORD=your-password
```

---

## Step 2: Test Email Connection

Before testing the full flow, verify your email configuration works:

1. Open terminal in `backend` folder
2. Run this command:
```bash
node -e "import('./utils/emailService.js').then(m => m.testEmailConnection()).then(r => console.log(r))"
```

Expected output:
```
{
  success: true,
  message: 'Email connection test successful'
}
```

If this fails, check your .env email settings before proceeding.

---

## Step 3: Start Servers

### Terminal 1 - Backend (Port 5000):
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Server running on http://localhost:5000
✅ MongoDB connected to safespeak-plus
```

### Terminal 2 - Frontend (Port 5174):
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5174/
```

---

## Step 4: Complete Email Verification Flow

### A. Register a New User

1. Open browser: `http://localhost:5174`
2. Click **"Register"** button
3. Fill form:
   - Email: Use a **real email address** (Gmail, Outlook, etc.)
   - Password: `Test@1234`
   - Confirm Password: `Test@1234`
4. Click **"Register Securely"**

Expected result:
- Page shows: "Check Your Email! 📧"
- Message says: "We've sent a verification link to [your-email]"
- Shows instructions: Check email → Click link → Get code → Login

### B. Check Your Email

1. Go to your email inbox (Gmail, Outlook, etc.)
2. Look for email from: `safespeak-plus@gmail.com` (or your SMTP_EMAIL)
3. Subject: "Verify Your SafeSpeak-Plus Account"
4. You should see:
   - HTML formatted email with SafeSpeak-Plus logo
   - Verification button/link
   - Text version of link: `http://localhost:5174/verify-email?token=abc123...`
   - 24-hour expiry warning

⚠️ **If email doesn't arrive:**
- Check spam/junk folder
- Check .env email settings
- Check console for error messages
- Run email connection test again

### C. Click Verification Link

1. Click the verification link in email
2. OR manually navigate to: `http://localhost:5174/verify-email?token=[the-token-from-email]`

Expected behavior:
- Page shows loading spinner: "Verifying Email"
- After 1-2 seconds, shows success page
- Displays green checkmark: "Email Verified!"
- Shows **Your Access Code** (16-character code)
- Example: `ABC-1234-DEF-5678`

### D. Save Your Code and Login

1. Click **"Copy"** button to copy the anonymous code
2. Or write down the code manually
3. Click **"Go to Login"** button
4. On login page, you have 2 options:

**Option 1 - Login with Email & Password:**
- Email: (the email you registered with)
- Password: `Test@1234`
- Click **"Sign in with Email"**

**Option 2 - Login with Anonymous Code:**
- Code: (paste the code from verification page)
- Click **"Sign in with Code"**

Expected result:
- Either method should redirect to **Dashboard**
- Shows: "Welcome back!" with your email
- Dashboard fully functional

---

## Step 5: Error Cases Testing

### Test Case 1: Expired Token
1. Get verification link from email
2. Wait 24+ hours (or manually set system time forward)
3. Click the verification link
4. Expected: "Verification Failed - Token may be expired"
5. Solution: Register again to get a new link

### Test Case 2: Invalid Token
1. Go to: `http://localhost:5174/verify-email?token=invalid-token-xyz`
2. Expected: "Verification Failed - No verification token found"

### Test Case 3: Already Verified Email
1. Register with email: `test@example.com`
2. Verify the email (get code)
3. Go back to first verification link
4. Click it again
5. Expected: "Verification Failed - Token already used"

### Test Case 4: Duplicate Registration
1. Register with email: `test@example.com`
2. Try to register again with same email
3. Expected: "This email is already registered"
4. Cannot bypass by verification

---

## Step 6: Complete User Journey Test

Follow this step-by-step to verify entire feature:

**Day 1 - Registration:**
```
1. Register with: user1@gmail.com, password: Test@1234
   ✓ Form validation works
   ✓ Success page shows "Check your email"

2. Check email inbox
   ✓ Verification email arrived
   ✓ Email has proper formatting
   ✓ Verification link is clickable

3. Click verification link
   ✓ Page loads with verification token
   ✓ Auto-processes token (shows "Verifying...")
   ✓ Displays success with anonymous code
   ✓ Code is unique and copy-able

4. Go to login
   ✓ Can login with email + password
   ✓ OR can login with anonymous code
   ✓ Both methods lead to dashboard

5. Access dashboard
   ✓ Dashboard loads properly
   ✓ Shows user's email
   ✓ Full functionality works
```

---

## Step 7: Database Verification

### Check MongoDB for User Record

Open MongoDB Compass or Atlas UI:
1. Navigate to: `Database > safespeak-plus > users`
2. Find your test user
3. Verify these fields:
   - `email`: Your email address
   - `isEmailVerified`: `true` (after verification)
   - `verificationToken`: `null` (after verification)
   - `verificationTokenExpiry`: `null` (after verification)
   - `anonymousCode`: Present (after verification)

---

## Step 8: Common Issues & Solutions

### Issue 1: "Failed to fetch" on registration
**Solution:**
- Check backend is running on port 5000
- Check CORS setting in backend/.env: `FRONTEND_URL=http://localhost:5174`
- Restart both servers

### Issue 2: Email not arriving
**Solution:**
- Check SMTP_EMAIL and SMTP_PASSWORD in .env
- Run email connection test
- Check spam folder
- For Gmail: Use App Password, not regular password
- Check console for error messages

### Issue 3: Verification link doesn't work
**Solution:**
- Check token is in URL: `?token=abc123...`
- Check 24-hour expiration hasn't passed
- Try copying token into a new verification attempt
- Check console for error messages

### Issue 4: Can't login after verification
**Solution:**
- Clear browser cache/cookies
- Try incognito/private window
- Check token is saved in localStorage
- Try both login methods (email + code)

### Issue 5: Anonymous code not displayed
**Solution:**
- Check registration completed successfully
- Try clicking verification link again
- Check database for anonymousCode field
- Check console for errors

---

## File Changes Summary

### Backend (Completed ✅)
- **utils/emailService.js** (NEW) - Email sending utility (315 lines)
- **models/User.js** (MODIFIED) - Added verificationTokenExpiry field
- **controllers/authController.js** (MODIFIED) - Register sends email, new verifyEmail function
- **routes/authRoutes.js** (MODIFIED) - Added /verify-email endpoint

### Frontend (Completed ✅)
- **services/authService.js** (MODIFIED) - Added verifyEmail() function
- **pages/VerificationPage.jsx** (NEW) - Email verification page (200+ lines)
- **pages/RegisterPage.jsx** (MODIFIED) - Updated success message
- **App.jsx** (MODIFIED) - Added /verify-email route

---

## Architecture Overview

```
User Registration Flow:
┌─────────────────────────────────────────────────────────┐
│ 1. User fills registration form                         │
│    - Email: test@gmail.com                              │
│    - Password: Test@1234                                │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Frontend sends POST /register                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Backend processes registration:                      │
│    - Validate inputs                                    │
│    - Hash password                                      │
│    - Create user (isEmailVerified = false)              │
│    - Generate verification token (32 bytes hex)         │
│    - Set expiry: 24 hours from now                      │
│    - Save to database                                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Send verification email:                             │
│    - Create HTML email with styling                     │
│    - Include link: /verify-email?token=abc123...        │
│    - Send via nodemailer (SMTP)                         │
│    - Email fails? Delete user account (cleanup)         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Frontend shows: "Check your email"                   │
│    - User receives verification email                   │
│    - Click link in email                                │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 6. VerificationPage loads with token                    │
│    - Extract ?token=abc123 from URL                     │
│    - Send POST /verify-email with token                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 7. Backend verifies token:                              │
│    - Find user with matching token                      │
│    - Check token not expired (< 24 hours)               │
│    - Token invalid/expired? Return 400 error            │
│    - Token valid? Mark isEmailVerified = true           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 8. Generate anonymous code NOW (only after verified):   │
│    - Create unique 16-character code                    │
│    - Save to user.anonymousCode                         │
│    - Clear verification token                           │
│    - Return code to frontend                            │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 9. Frontend shows success:                              │
│    - Display anonymous code                             │
│    - "Copy to clipboard" button                         │
│    - "Go to Login" button                               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 10. User can now login:                                 │
│    - Option A: Email + Password                         │
│    - Option B: Anonymous Code                           │
│    - Either method redirects to Dashboard               │
└─────────────────────────────────────────────────────────┘
```

---

## Next Steps (Optional Enhancements)

After verifying the basic flow works, consider adding:

1. **Resend Email Button**
   - User can request new verification email if first one expired

2. **Password Reset**
   - Uses similar email token system
   - Email: "Reset your password"
   - Link: `/reset-password?token=xyz`

3. **Email Change**
   - User can change email after registration
   - Requires re-verification

4. **Rate Limiting**
   - Prevent spam registration attempts
   - Limit email sends per hour

5. **Email Logging**
   - Track which emails were sent
   - When they were sent
   - Whether they bounced

---

## Questions?

If something doesn't work:
1. Check the console (browser DevTools) for errors
2. Check the terminal (backend) for error messages
3. Verify all .env settings are correct
4. Check MongoDB Atlas connection
5. Verify email provider credentials

**Good luck with your testing!** 🚀
