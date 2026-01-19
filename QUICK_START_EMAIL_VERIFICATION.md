# Quick Start Checklist - Email Verification Testing

## Before You Start

- [ ] You have a Gmail or Outlook account
- [ ] You have access to that email account
- [ ] Both backend and frontend are installed (`npm install` done)
- [ ] MongoDB Atlas connection is working
- [ ] VS Code is open with the project

---

## Part 1: Configure Email (Do This First!)

### If Using Gmail:

**Step 1: Enable 2-Step Verification**
- [ ] Go to https://myaccount.google.com/security
- [ ] Click "2-Step Verification"
- [ ] Follow the prompts to enable it

**Step 2: Create App Password**
- [ ] In same Security page, find "App passwords"
- [ ] Select "Mail" and "Windows Computer"
- [ ] Google will generate a 16-character password
- [ ] Copy this password (remove spaces)

**Step 3: Update .env File**
- [ ] Open `backend/.env`
- [ ] Find these lines:
  ```
  SMTP_SERVICE=gmail
  SMTP_EMAIL=your-email@gmail.com
  SMTP_PASSWORD=your_app_password_here
  ```
- [ ] Replace `your-email@gmail.com` with your actual Gmail
- [ ] Replace `your_app_password_here` with the 16-char password from Step 2
- [ ] Save the file

### If Using Outlook:

**Step 1: Update .env File**
- [ ] Open `backend/.env`
- [ ] Find these lines:
  ```
  SMTP_SERVICE=outlook
  SMTP_EMAIL=your-email@outlook.com
  SMTP_PASSWORD=your_password
  ```
- [ ] Replace with your Outlook email and password
- [ ] Save the file

---

## Part 2: Test Email Connection

**Step 1: Open Terminal**
- [ ] Open a new terminal in VS Code
- [ ] Navigate to backend folder: `cd backend`

**Step 2: Run Test**
- [ ] Copy and paste this command:
  ```
  node -e "import('./utils/emailService.js').then(m => m.testEmailConnection()).then(r => console.log(r))"
  ```
- [ ] Press Enter

**Step 3: Check Result**
- [ ] Look for this output:
  ```
  { success: true, message: 'Email connection test successful' }
  ```
- [ ] If successful, continue to Part 3
- [ ] If failed, check your email settings and try again

---

## Part 3: Start the Servers

### Terminal 1 - Backend Server

- [ ] Open **new** terminal (keep test terminal open)
- [ ] Run: `cd backend`
- [ ] Run: `npm run dev`
- [ ] Wait for output like:
  ```
  🚀 Server running at: http://localhost:5000
  ✅ MongoDB Connected Successfully!
  ```
- [ ] Leave this terminal open

### Terminal 2 - Frontend Server

- [ ] Open **another new** terminal
- [ ] Run: `cd frontend`
- [ ] Run: `npm run dev`
- [ ] Wait for output like:
  ```
  VITE v... ready in ... ms
  ➜  Local:   http://localhost:5174/
  ```
- [ ] Leave this terminal open

**Now you have 3 terminals open:**
1. Original (closed or for other use)
2. Backend running on port 5000
3. Frontend running on port 5174

---

## Part 4: Test Complete Registration Flow

**Step 1: Open Browser**
- [ ] Open browser (Chrome, Firefox, Edge, etc.)
- [ ] Go to: `http://localhost:5174`
- [ ] You should see SafeSpeak-Plus landing page

**Step 2: Click Register**
- [ ] Click the "Register" button
- [ ] You should see registration form

**Step 3: Fill Form**
- [ ] Email: Enter your **real email address** (gmail, outlook, etc.)
- [ ] Password: `Test@1234`
- [ ] Confirm Password: `Test@1234`
- [ ] Click "Register Securely"

**Step 4: Success Page**
- [ ] Should see: "Check Your Email! 📧"
- [ ] Should show your email address
- [ ] Should show instructions

**Step 5: Check Email**
- [ ] Go to your email inbox (Gmail, Outlook, etc.)
- [ ] Look for email from: `safespeak-plus@gmail.com` (or your sender)
- [ ] Subject: "Verify Your SafeSpeak-Plus Account"
- [ ] Open the email

**Step 6: Click Verification Link**
- [ ] In email, click the verification link
- [ ] OR copy the link and paste in browser
- [ ] You should be redirected to verification page

**Step 7: See Loading Spinner**
- [ ] Page shows: "Verifying Email..."
- [ ] Wait 1-2 seconds while it processes

**Step 8: See Success**
- [ ] Green checkmark appears: "Email Verified!"
- [ ] Your anonymous code is displayed
- [ ] Example: `ABC-1234-DEF-5678`

**Step 9: Copy Code**
- [ ] Click "Copy" button next to your code
- [ ] Code is now in your clipboard
- [ ] Write it down somewhere safe

**Step 10: Go to Login**
- [ ] Click "Go to Login" button
- [ ] You should see login page

**Step 11: Login with Code**
- [ ] Code field appears on login page
- [ ] Paste (Ctrl+V) your code
- [ ] Click "Sign in with Code"
- [ ] Should redirect to Dashboard

**Step 12: Success!**
- [ ] You should see dashboard
- [ ] Says "Welcome back!"
- [ ] Shows your email
- [ ] Dashboard is fully functional

---

## Troubleshooting

### Problem: Email doesn't arrive

**Solution:**
- [ ] Check spam/junk folder
- [ ] Check .env settings are correct (no typos)
- [ ] Run email connection test again
- [ ] Check backend terminal for error messages
- [ ] Try different email provider (if possible)

### Problem: Verification link shows error

**Solution:**
- [ ] Check URL has token: `?token=abc123...`
- [ ] Try refreshing the page
- [ ] Check backend terminal for error messages
- [ ] Make sure backend is running

### Problem: Code doesn't display

**Solution:**
- [ ] Check browser console (F12, Console tab)
- [ ] Check backend console for error messages
- [ ] Try verification again
- [ ] Make sure MongoDB is connected

### Problem: Can't login with code

**Solution:**
- [ ] Make sure code is correct (copied properly)
- [ ] Check for extra spaces in code
- [ ] Try login with email/password instead
- [ ] Clear browser cache and try again

### Problem: Backend won't start

**Solution:**
- [ ] Check MongoDB is connected
- [ ] Check .env file is correct
- [ ] Run: `node -c backend/server.js` (checks syntax)
- [ ] Make sure port 5000 is available
- [ ] Restart the terminal

### Problem: Frontend won't start

**Solution:**
- [ ] Check backend is running first
- [ ] Make sure port 5174 is available
- [ ] Run: `npm install` in frontend folder
- [ ] Clear node_modules and reinstall

---

## Success Checklist

After completing all steps, you should have:

- [ ] ✅ Email configured in .env
- [ ] ✅ Email connection test passed
- [ ] ✅ Backend server running on port 5000
- [ ] ✅ Frontend server running on port 5174
- [ ] ✅ Registered with real email address
- [ ] ✅ Received verification email
- [ ] ✅ Clicked verification link
- [ ] ✅ Saw anonymous code
- [ ] ✅ Logged in with code
- [ ] ✅ Accessed dashboard

**If all checked:** Email verification feature is working! 🎉

---

## What Happens Next?

Now that email verification works, you can:

1. **Register more test accounts** to verify flow works consistently
2. **Test with different email providers** (Gmail, Outlook, etc.)
3. **Test error cases** (expired tokens, invalid tokens)
4. **Show friends/family** how to register and use the app
5. **File test reports** to verify full system works

---

## Need Help?

Refer to these files in the project root:

- `EMAIL_VERIFICATION_TEST.md` - Detailed testing guide
- `EMAIL_VERIFICATION_IMPLEMENTATION.md` - Technical details
- `EMAIL_VERIFICATION_COMPLETE.md` - Implementation summary
- `BACKEND_SETUP_NOTES.md` - Backend configuration help

---

## Time Estimate

- Setup email: 5-10 minutes
- Test connection: 2 minutes
- Start servers: 2 minutes
- Complete test flow: 10-15 minutes

**Total: About 20-30 minutes**

---

Good luck! You've got this! 🚀

After completing this, come back and let me know:
1. Did the email arrive?
2. Did the verification work?
3. Can you login with the code?
4. Is the dashboard accessible?
